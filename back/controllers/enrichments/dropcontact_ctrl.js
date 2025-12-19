// controllers/enrichments/dropcontact_ctrl.js
const pool = require("../../connection/sqlConnection");
const { enrichDropcontact } = require("../../services/dropcontactService");
const { sendProspectionEmail } = require("../../services/emailService"); // <--- Import du service mail

function computeNextRetry(attemptCount) {
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

      const [rows] = await conn.query(
        `
        SELECT
          e.id AS enrichment_id,
          e.entity_type,
          e.entity_id,
          e.attempt_count,
          ent.id AS entreprise_id,
          ent.siren AS entreprise_siren,
          ent.denomination AS entreprise_denomination,
          ent.tranche_effectif AS entreprise_tranche, -- Ajouté pour le template mail
          ent.email AS entreprise_email,
          d.id AS dirigeant_id,
          d.firstname,
          d.lastname,
          d.email AS dirigeant_email,
          ent2.denomination AS ent2_denomination,
          ent2.tranche_effectif AS ent2_tranche
        FROM enrichments e
        LEFT JOIN entreprises ent ON e.entity_type='ENTREPRISE' AND ent.id = e.entity_id
        LEFT JOIN dirigeants d ON e.entity_type='DIRIGEANT' AND d.id = e.entity_id
        LEFT JOIN entreprises ent2 ON e.entity_type='DIRIGEANT' AND ent2.id = d.entreprise_id
        WHERE e.provider='DROPCONTACT'
          AND (e.status='NEVER' OR (e.status='ERROR' AND e.next_retry_at <= NOW()))
          AND ((e.entity_type='ENTREPRISE' AND ent.email IS NULL) OR (e.entity_type='DIRIGEANT' AND d.email IS NULL))
        ORDER BY (e.status='NEVER') DESC, e.next_retry_at ASC, e.updated_at ASC
        LIMIT ?
        FOR UPDATE`,
        [limit]
      );

      jobs = rows;

      if (jobs.length) {
        const ids = jobs.map((j) => j.enrichment_id);
        await conn.query(
          `UPDATE enrichments SET attempt_count = attempt_count + 1, last_called_at = NOW(), last_error = NULL WHERE id IN (${ids.map(() => "?").join(",")})`,
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
    let processed = 0; let found = 0; let notFound = 0; let errors = 0;

    for (const job of jobs) {
      // Payload pour Dropcontact
      const payload = job.entity_type === "ENTREPRISE" 
        ? { type: "ENTREPRISE", entreprise: { id: job.entreprise_id, siren: job.entreprise_siren, denomination: job.entreprise_denomination } }
        : { type: "DIRIGEANT", entreprise: { denomination: job.ent2_denomination }, dirigeant: { id: job.dirigeant_id, firstname: job.firstname, lastname: job.lastname } };

      try {
        const out = await enrichDropcontact(payload);

        const conn2 = await pool.getConnection();
        try {
          await conn2.beginTransaction();

          if (out?.status === "FOUND" && out?.email) {
            // Mise à jour de l'email (Entreprise ou Dirigeant)
            if (job.entity_type === "ENTREPRISE") {
              await conn2.query(`UPDATE entreprises SET email=? WHERE id=?`, [out.email, job.entreprise_id]);
            } else {
              await conn2.query(`UPDATE dirigeants SET email=? WHERE id=?`, [out.email, job.dirigeant_id]);
            }

            await conn2.query(`UPDATE enrichments SET status='FOUND', provider_ref=?, next_retry_at=NULL WHERE id=?`, [out.provider_ref, job.enrichment_id]);

            // --- ENVOI DE L'EMAIL AUTOMATIQUE ---
            try {
              await sendProspectionEmail({
                email: out.email,
                firstname: job.firstname || "Directeur",
                lastname: job.lastname || "",
                denomination: job.entreprise_denomination || job.ent2_denomination,
                tranche_effectif: job.entreprise_tranche || job.ent2_tranche
              });
            } catch (mailErr) {
              console.error("Erreur d'envoi mail, mais enrichment OK:", mailErr);
              // On ne bloque pas le processus si seul le mail échoue
            }
            // -------------------------------------

            found++;
          } else {
            await conn2.query(`UPDATE enrichments SET status='NOT_FOUND', provider_ref=?, next_retry_at=NULL WHERE id=?`, [out?.provider_ref, job.enrichment_id]);
            notFound++;
          }

          await conn2.commit();
          processed++;
        } finally {
          conn2.release();
        }
      } catch (e) {
        // Gestion de l'erreur et retry
        const conn3 = await pool.getConnection();
        try {
          const nextRetry = computeNextRetry(job.attempt_count + 1);
          await conn3.query(`UPDATE enrichments SET status='ERROR', last_error=?, next_retry_at=? WHERE id=?`, [String(e?.message).slice(0, 255), nextRetry, job.enrichment_id]);
        } finally { conn3.release(); }
        errors++; processed++;
      }
    }

    return res.json({ msg: "ok", processed, found, notFound, errors });
  } catch (err) {
    return res.status(500).json({ error: err?.message });
  }
};