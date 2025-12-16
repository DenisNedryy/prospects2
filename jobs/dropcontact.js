// dropcontact.js
require('dotenv').config();

const fs = require('fs');
const path = require('path');

// ⚠️ Clé API Dropcontact depuis le .env
const DROPCONTACT_API_KEY = process.env.DROPCONTACT_API_KEY;

if (!DROPCONTACT_API_KEY) {
  console.error("❌ ERREUR : la variable DROPCONTACT_API_KEY n'est pas définie dans le fichier .env");
  process.exit(1);
}

// Fichier d'entrée et de sortie
const INPUT_FILE = path.join(__dirname, 'prospects.json');          // ton fichier JSON (celui que tu viens de montrer)
const OUTPUT_FILE = path.join(__dirname, 'prospects_enrichis.json');

const ENRICH_URL = 'https://api.dropcontact.com/v1/enrich/all';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// On découpe "Bechet Sylvain" → { nom: "Bechet", prenom: "Sylvain" }
function splitNomPrenom(full = "") {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { nom: full.trim(), prenom: "" };
  }
  const nom = parts[0];
  const prenom = parts.slice(1).join(" ");
  return { nom, prenom };
}

async function main() {
  // 1. Charger le fichier JSON complet
  const raw = fs.readFileSync(INPUT_FILE, 'utf8');
  const fullData = JSON.parse(raw);

  const departement = fullData.departement;
  const total = fullData.total;
  const prospects = fullData.prospects || [];

  if (!Array.isArray(prospects) || prospects.length === 0) {
    console.error("❌ ERREUR : Aucun prospect trouvé dans `prospects`.");
    process.exit(1);
  }

  console.log(`Département ${departement} – ${prospects.length} prospects trouvés.`);

  // 2. Construire le payload pour Dropcontact à partir des DIRIGEANTS
  const payload = { data: [] };

  prospects.forEach(p => {
    const dirigeants = Array.isArray(p.dirigeants) ? p.dirigeants : [];
    dirigeants.forEach(d => {
      if (!d) return;

      const { nom, prenom } = splitNomPrenom(d);

      payload.data.push({
        full_name: `${prenom} ${nom}`.trim(), // Dropcontact comprend full_name (Prénom Nom)
        company: p.nom,
        country: 'france',
        custom_fields: {
          siret: p.siret,
          siren: p.siren,
          dirigeant: d, // pour recoller les résultats à la fin
        },
      });
    });
  });

  if (payload.data.length === 0) {
    console.log("😅 Aucun dirigeant à envoyer à Dropcontact (toutes les listes 'dirigeants' sont vides).");
    return;
  }

  console.log(`Envoi de ${payload.data.length} dirigeants à Dropcontact…`);

  try {
    // 3. Envoi du POST à Dropcontact
    const startResp = await fetch(ENRICH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': DROPCONTACT_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const startData = await startResp.json();

    if (!startResp.ok) {
      console.error('❌ ERREUR à l’envoi du batch :', startData);
      process.exit(1);
    }

    const requestId = startData.request_id;
    if (!requestId) {
      console.error("❌ ERREUR : Dropcontact n’a pas renvoyé de request_id :", startData);
      process.exit(1);
    }

    console.log('Batch lancé, request_id =', requestId);

    // 4. Polling : GET /v1/enrich/all/{request_id}
    let result = null;
    let attempts = 0;

    while (true) {
      attempts++;
      console.log(`Vérification #${attempts}…`);

      const statusResp = await fetch(`${ENRICH_URL}/${requestId}`, {
        method: 'GET',
        headers: {
          'X-Access-Token': DROPCONTACT_API_KEY,
        },
      });

      const statusData = await statusResp.json();

      if (!statusResp.ok) {
        console.error('❌ ERREUR lors de la vérification du batch :', statusData);
        process.exit(1);
      }

      if (statusData.success === true && Array.isArray(statusData.data)) {
        console.log('Traitement terminé ✅');
        result = statusData;
        break;
      }

      console.log(
        `Toujours en cours… (${statusData.reason || 'pas prêt'}) nouvelle vérification dans 10 secondes.`
      );
      await sleep(10000);
    }

    // 5. Résultats enrichis (par dirigeant)
    const enriched = result.data || [];

    // On indexe par "siret::nomDirigeant"
    const enrichedByKey = {};
    enriched.forEach(item => {
      const cf = item.custom_fields || {};
      const siret = cf.siret;
      const dirigeantName = cf.dirigeant;
      if (!siret || !dirigeantName) return;

      const key = `${siret}::${dirigeantName}`;
      const emailArray = Array.isArray(item.email) ? item.email : [];
      const allEmails = emailArray.map(e => e.email).filter(Boolean);
      const primaryEmail = allEmails[0] || null;

      enrichedByKey[key] = {
        nomComplet: dirigeantName,
        emails: allEmails,
        email: primaryEmail,
      };
    });

    // 6. Fusion : enrichir chaque prospect avec les emails des DIRIGEANTS
    const mergedProspects = prospects.map(p => {
      const dirigeants = Array.isArray(p.dirigeants) ? p.dirigeants : [];
      const dirigeantsEmails = dirigeants.map(d => {
        const key = `${p.siret}::${d}`;
        return (
          enrichedByKey[key] || {
            nomComplet: d,
            emails: [],
            email: null,
          }
        );
      });

      return {
        ...p,
        dirigeantsEmails,
      };
    });

    // 7. Réécrire la structure globale avec prospects enrichis
    const outputData = {
      departement,
      total,
      prospects: mergedProspects,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`📁 Fichier enrichi sauvegardé dans : ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Erreur Dropcontact ou script :', error);
  }
}

main();
