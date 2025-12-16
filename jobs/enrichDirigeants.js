// enrichDirigeants.js
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PappersClient } from "./pappersClient.js";

dotenv.config();

// Gestion de __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚠️ Clé API Pappers
const PAPPERS_API_KEY = process.env.PAPPERS_API_KEY;
if (!PAPPERS_API_KEY) {
  console.error("❌ PAPPERS_API_KEY manquante dans .env");
  process.exit(1);
}

const pappers = new PappersClient({
  apiToken: PAPPERS_API_KEY,
});

// FICHIER D'ENTRÉE / SORTIE (adapte le nom au besoin)
const INPUT_FILE = path.join(__dirname, "prospects_seminaires_dep86.json");
const OUTPUT_FILE = path.join(
  __dirname,
  "prospects_seminaires_dep86_dirigeants.json"
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pour passer de "CHASLES" -> "Chasles", "SEBASTIEN" -> "Sebastien"
function toTitleCase(str = "") {
  return str
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function main() {
  const raw = fs.readFileSync(INPUT_FILE, "utf8");
  const data = JSON.parse(raw);

  const departement = data.departement;
  const prospects = data.prospects || [];

  console.log(
    `Département ${departement} – ${prospects.length} prospects à enrichir avec les dirigeants.`
  );

  // Cache par SIREN pour éviter d'appeler 10 fois Pappers pour le même siren
  const cacheBySiren = new Map();

  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];

    const siren = p.siren;
    if (!siren) {
      console.warn(
        `⚠️ Prospect sans SIREN (siret=${p.siret || "?"}), on le saute.`
      );
      p.dirigenants = [];
      continue;
    }

    if (!cacheBySiren.has(siren)) {
      try {
        console.log(
          `[${i + 1}/${prospects.length}] Appel Pappers pour SIREN ${siren} (${p.nom})…`
        );
        const fiche = await pappers.getEntrepriseBySiren(siren);

        const representants = Array.isArray(fiche.representants)
          ? fiche.representants
          : [];

        // On transforme en "Nom Prenom" avec une casse correcte
        const dirigeantsStrings = representants.map((r) => {
          const nom = toTitleCase(r.nom || "");
          const prenom = toTitleCase(r.prenom || "");
          // Tu voulais "Chasles Sebastien" → Nom puis Prénom
          return `${nom} ${prenom}`.trim();
        });

        cacheBySiren.set(siren, dirigeantsStrings);

        // On ralentit un peu pour ne pas bourriner l'API
        await sleep(300);
      } catch (err) {
        console.error(
          `❌ Erreur Pappers pour SIREN ${siren} :`,
          err.body || err.message
        );
        cacheBySiren.set(siren, []);
      }
    }

    const dirigeants = cacheBySiren.get(siren) || [];
    // 👉 EXACTEMENT ce que tu veux : "dirigenants": ["Chasles Sebastien", ...]
    p.dirigenants = dirigeants;
  }

  const output = {
    ...data,
    prospects,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`✅ Fichier enrichi généré : ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("❌ Erreur globale enrichDirigeants.js :", err);
});
