// controllers/enrichments/pappers_ctrl.js
const pool = require("../../connection/sqlConnection");

// ---- CONFIG
const PAPPERS_API_KEY = process.env.PAPPERS_API_KEY;
const PAPPERS_BASE_URL = process.env.PAPPERS_BASE_URL || "https://api.pappers.fr/v2";

// backoff simple en minutes selon attempt_count (1 -> 5m, 2 -> 15m, 3 -> 1h, 4 -> 6h, 5+ -> 24h)
function computeNextRetry(attemptCount, opts = {}) {
  const minutesSteps = [5, 15, 60, 360, 1440];
  let idx = Math.min(Math.max(attemptCount - 1, 0), minutesSteps.length - 1);

  // Si on a pris un rate-limit, on force un délai plus long
  if (opts.rateLimited) idx = Math.max(idx, 3); // >= 6h

  const minutes = minutesSteps[idx];
  return new Date(Date.now() + minutes * 60 * 1000);
}

async function fetchPappersEntrepriseBySiren(siren) {
  if (!PAPPERS_API_KEY) throw new Error("PAPPERS_API_KEY manquant");
  if (!siren) throw new Error("SIREN manquant");

  const url = new URL(`${PAPPERS_BASE_URL}/entreprise`);
  url.searchParams.set("api_token", PAPPERS_API_KEY);
  url.searchParams.set("siren", siren);

  const r = await fetch(url.toString(), { method: "GET" });
  const text = await r.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  if (!r.ok) {
    const err = new Error(`Pappers HTTP ${r.status}: ${text.slice(0, 200)}`);
    err.httpStatus = r.status;
    err.body = json || text;
    throw err;
  }

  return json;
}

// normalisation basique
function cleanStr(x) {
  return String(x || "").trim();
}

function mapDirigeantsFromPappers(pappersJson) {
  // Selon les retours Pappers, "representants" est le plus courant.
  const reps = pappersJson?.representants || pappersJson?.dirigeants || [];
  return reps
    .map((r) => ({
      firstname: cleanStr(r?.prenom || r?.firstname || r?.first_name),
      lastname: cleanStr(r?.nom || r?.lastname || r?.last_name),
      fonction: cleanStr(r?.qualite || r?.fonction) || null,
    }))
    .filter((d) => d.firstname && d.lastname);
}

exports.runBatch = async (req, res) => {
  const limit = Math.min(Number(req.body?.limit || 25), 100);

  try {
    // 1) sélectionner un batch depuis enrichments (ENTREPRISE + PAPPERS) prêt à traiter
    //    + ANTI-REPAYER: ne prendre que les entreprises qui n'ont AUCUN dirigeant en base
    const conn = await pool.getConnection();
    let jobs = [];
    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        `
        SELECT
          e.id AS enrichment_id,
          e.attempt_count,
          e.entity_id AS entreprise_id,
          ent.siren
        FROM enrichments e
        JOIN entreprises ent ON ent.id = e.entity_id
        LEFT JOIN dirigeants d ON d.entreprise_id = ent.id
        WHERE e.entity_type='ENTREPRISE'
          AND e.provider='PAPPERS'
          AND d.id IS NULL
          AND (
            e.status='NEVER'
            OR (e.status='ERROR' AND e.next_retry_at IS NOT NULL AND e.next_retry_at <= NOW())
          )
        ORDER BY (e.status='NEVER') DESC, e.next_retry_at ASC, e.updated_at ASC
        LIMIT ?
        FOR UPDATE
        `,
        [limit]
      );

      jobs = rows;

      // Marquer tout de suite "tentative" (attempt_count + last_called_at) pour éviter double workers
      if (jobs.length) {
        const ids = jobs.map((j) => j.enrichment_id);
        await conn.query(
          `
          UPDATE enrichments
          SET attempt_count = attempt_count + 1,
              last_called_at = NOW(),
              last_error = NULL
          WHERE id IN (${ids.map(() => "?").join(",")})
          `,
          ids
        );
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    if (!jobs.length) {
      return res.json({ msg: "no jobs", processed: 0, found: 0, notFound: 0, errors: 0 });
    }

    // 2) traiter chaque job (appel réseau hors transaction, puis write en transaction)
    let processed = 0,
      found = 0,
      notFound = 0,
      errors = 0;

    for (const job of jobs) {
      try {
        const pappersJson = await fetchPappersEntrepriseBySiren(job.siren);
        const dirigeants = mapDirigeantsFromPappers(pappersJson);

        // provider_ref utile pour audit: on stocke un identifiant stable si dispo
        const providerRef = cleanStr(pappersJson?.siren || job.siren) || null;

        const conn2 = await pool.getConnection();
        try {
          await conn2.beginTransaction();

          if (!dirigeants.length) {
            await conn2.query(
              `
              UPDATE enrichments
              SET status='NOT_FOUND',
                  provider_ref = ?,
                  next_retry_at = NULL
              WHERE id=?
              `,
              [providerRef, job.enrichment_id]
            );
            await conn2.commit();
            notFound++;
            processed++;
            continue;
          }

          // upsert dirigeants + seed Dropcontact DIRIGEANT
          for (const d of dirigeants) {
            const [ins] = await conn2.query(
              `
              INSERT INTO dirigeants (entreprise_id, firstname, lastname, fonction)
              VALUES (?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
                fonction = VALUES(fonction)
              `,
              [job.entreprise_id, d.firstname, d.lastname, d.fonction]
            );

            // récupérer id dirigeant (insert ou existant)
            let dirigeantId = ins.insertId;
            if (!dirigeantId) {
              const [r] = await conn2.query(
                `SELECT id FROM dirigeants WHERE entreprise_id=? AND firstname=? AND lastname=? LIMIT 1`,
                [job.entreprise_id, d.firstname, d.lastname]
              );
              dirigeantId = r?.[0]?.id;
            }

            // seed Dropcontact pour DIRIGEANT (anti-repaiement assuré par INSERT IGNORE + filtre email NULL côté dropcontact ctrl)
            if (dirigeantId) {
              await conn2.query(
                `
                INSERT IGNORE INTO enrichments (entity_type, entity_id, provider, status)
                VALUES ('DIRIGEANT', ?, 'DROPCONTACT', 'NEVER')
                `,
                [dirigeantId]
              );
            }
          }

          // marquer FOUND
          await conn2.query(
            `
            UPDATE enrichments
            SET status='FOUND',
                provider_ref=?,
                next_retry_at=NULL
            WHERE id=?
            `,
            [providerRef, job.enrichment_id]
          );

          await conn2.commit();
          found++;
          processed++;
        } catch (e) {
          await conn2.rollback();
          throw e;
        } finally {
          conn2.release();
        }
      } catch (e) {
        // erreur Pappers / parse / etc => ERROR + retry
        const rateLimited = Number(e?.httpStatus) === 429;

        const conn3 = await pool.getConnection();
        try {
          const [r] = await conn3.query(
            `SELECT attempt_count FROM enrichments WHERE id=? LIMIT 1`,
            [job.enrichment_id]
          );
          const attemptCount = r?.[0]?.attempt_count || 1;
          const nextRetry = computeNextRetry(attemptCount, { rateLimited });

          await conn3.query(
            `
            UPDATE enrichments
            SET status='ERROR',
                last_error=?,
                next_retry_at=?
            WHERE id=?
            `,
            [String(e?.message || e).slice(0, 255), nextRetry, job.enrichment_id]
          );
        } finally {
          conn3.release();
        }

        errors++;
        processed++;
      }
    }

    return res.json({ msg: "ok", processed, found, notFound, errors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err?.message || err });
  }
};
