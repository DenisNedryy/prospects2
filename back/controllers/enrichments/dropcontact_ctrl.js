// controllers/enrichments/dropcontact_ctrl.js
const pool = require("../../connection/sqlConnection");
const { enrichDropcontact } = require("../../services/dropcontactService");

function computeNextRetry(attemptCount) {
  // 5m, 15m, 1h, 6h, 24h
  const steps = [5, 15, 60, 360, 1440];
  const minutes = steps[Math.min(Math.max(attemptCount - 1, 0), steps.length - 1)];
  return new Date(Date.now() + minutes * 60 * 1000);
}

exports.runBatch = async (req, res) => {
  const limit = Math.min(Number(req.body?.limit || 25), 100);

  try {
    // 1) Prendre un batch de jobs Dropcontact "traitables"
    const conn = await pool.getConnection();
    let jobs = [];
    try {
      await conn.beginTransaction();

      // IMPORTANT: on ne prend que les jobs dont l'email est encore NULL (anti-repaiement)
      const [rows] = await conn.query(
        `
        SELECT
          e.id AS enrichment_id,
          e.entity_type,
          e.entity_id,
          e.attempt_count,

          -- entreprise quand entity_type = ENTREPRISE
          ent.id AS entreprise_id,
          ent.siren AS entreprise_siren,
          ent.denomination AS entreprise_denomination,
          ent.adresse AS entreprise_adresse,
          ent.ville AS entreprise_ville,
          ent.email AS entreprise_email,

          -- dirigeant quand entity_type = DIRIGEANT
          d.id AS dirigeant_id,
          d.entreprise_id AS dirigeant_entreprise_id,
          d.firstname,
          d.lastname,
          d.fonction,
          d.email AS dirigeant_email,

          -- entreprise du dirigeant
          ent2.id AS ent2_id,
          ent2.siren AS ent2_siren,
          ent2.denomination AS ent2_denomination,
          ent2.adresse AS ent2_adresse,
          ent2.ville AS ent2_ville,
          ent2.email AS ent2_email

        FROM enrichments e
        LEFT JOIN entreprises ent
          ON e.entity_type='ENTREPRISE' AND ent.id = e.entity_id
        LEFT JOIN dirigeants d
          ON e.entity_type='DIRIGEANT' AND d.id = e.entity_id
        LEFT JOIN entreprises ent2
          ON e.entity_type='DIRIGEANT' AND ent2.id = d.entreprise_id

        WHERE e.provider='DROPCONTACT'
          AND (
            e.status='NEVER'
            OR (e.status='ERROR' AND e.next_retry_at IS NOT NULL AND e.next_retry_at <= NOW())
          )
          AND (
            (e.entity_type='ENTREPRISE' AND ent.email IS NULL)
            OR (e.entity_type='DIRIGEANT' AND d.email IS NULL)
          )

        ORDER BY (e.status='NEVER') DESC, e.next_retry_at ASC, e.updated_at ASC
        LIMIT ?
        FOR UPDATE
        `,
        [limit]
      );

      jobs = rows;

      // bump attempt_count + last_called_at pour éviter double traitement
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

    // 2) Traiter chaque job
    let processed = 0;
    let found = 0;
    let notFound = 0;
    let errors = 0;

    for (const job of jobs) {
      // double sécurité anti-repaiement (si data a changé depuis le SELECT)
      if (job.entity_type === "ENTREPRISE" && job.entreprise_email) {
        const c = await pool.getConnection();
        try {
          await c.query(`UPDATE enrichments SET status='FOUND', next_retry_at=NULL WHERE id=?`, [
            job.enrichment_id,
          ]);
        } finally {
          c.release();
        }
        processed++;
        found++;
        continue;
      }

      if (job.entity_type === "DIRIGEANT" && job.dirigeant_email) {
        const c = await pool.getConnection();
        try {
          await c.query(`UPDATE enrichments SET status='FOUND', next_retry_at=NULL WHERE id=?`, [
            job.enrichment_id,
          ]);
        } finally {
          c.release();
        }
        processed++;
        found++;
        continue;
      }

      // payload "unifié" pour le service Dropcontact
      const payload =
        job.entity_type === "ENTREPRISE"
          ? {
              type: "ENTREPRISE",
              entreprise: {
                id: job.entreprise_id,
                siren: job.entreprise_siren,
                denomination: job.entreprise_denomination,
                adresse: job.entreprise_adresse,
                ville: job.entreprise_ville,
              },
            }
          : {
              type: "DIRIGEANT",
              entreprise: {
                id: job.ent2_id || job.dirigeant_entreprise_id,
                siren: job.ent2_siren,
                denomination: job.ent2_denomination,
                adresse: job.ent2_adresse,
                ville: job.ent2_ville,
              },
              dirigeant: {
                id: job.dirigeant_id,
                firstname: job.firstname,
                lastname: job.lastname,
                fonction: job.fonction,
              },
            };

      try {
        // 3) Appel Dropcontact
        // attendu: { status: 'FOUND'|'NOT_FOUND', email?: string, provider_ref?: string }
        const out = await enrichDropcontact(payload);

        const conn2 = await pool.getConnection();
        try {
          await conn2.beginTransaction();

          if (out?.status === "FOUND" && out?.email) {
            if (job.entity_type === "ENTREPRISE") {
              await conn2.query(`UPDATE entreprises SET email=? WHERE id=? AND email IS NULL`, [
                out.email,
                job.entreprise_id,
              ]);
            } else {
              await conn2.query(`UPDATE dirigeants SET email=? WHERE id=? AND email IS NULL`, [
                out.email,
                job.dirigeant_id,
              ]);
            }

            await conn2.query(
              `
              UPDATE enrichments
              SET status='FOUND',
                  provider_ref=?,
                  next_retry_at=NULL
              WHERE id=?
              `,
              [out.provider_ref || null, job.enrichment_id]
            );

            found++;
          } else {
            await conn2.query(
              `
              UPDATE enrichments
              SET status='NOT_FOUND',
                  provider_ref=?,
                  next_retry_at=NULL
              WHERE id=?
              `,
              [out?.provider_ref || null, job.enrichment_id]
            );

            notFound++;
          }

          await conn2.commit();
          processed++;
        } catch (e) {
          await conn2.rollback();
          throw e;
        } finally {
          conn2.release();
        }
      } catch (e) {
        // 4) ERROR + next_retry_at
        const conn3 = await pool.getConnection();
        try {
          const [r] = await conn3.query(
            `SELECT attempt_count FROM enrichments WHERE id=? LIMIT 1`,
            [job.enrichment_id]
          );
          const attemptCount = r?.[0]?.attempt_count || 1;
          const nextRetry = computeNextRetry(attemptCount);

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
