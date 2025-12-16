// findSeminarProspects.js
import dotenv from "dotenv";
import fs from "fs";
import { SireneClient } from "./sireneClient.js";

dotenv.config();

const client = new SireneClient({
  apiKey: process.env.SIRENE_API_KEY,
});

// Secteurs qui réservent typiquement des séminaires / réunions
const nafCodes = [
  "70.10Z", // sièges sociaux
  "70.22Z", // conseil en gestion
  "73.11Z", // agences de pub
  "73.20Z", // études de marché
  "82.30Z", // organisation de salons / congrès
  "85.59A", // formation continue adultes
  "85.59B", // autres enseignements
];

// Tranches d’effectifs un peu “sérieuses”
const effectifTranches = ["11", "12", "21", "22", "31"];  // code pour nombre de salariés 11= 10à19 et 12 = 20à49 21= 50 à 100

function buildQuery({ departement }) {
  const nafPart =
    "(" +
    nafCodes.map((c) => `activitePrincipaleUniteLegale:${c}`).join(" OR ") +
    ")";

  const effectifPart =
    "(" +
    effectifTranches
      .map((t) => `trancheEffectifsUniteLegale:${t}`)
      .join(" OR ") +
    ")";

  // Département → on filtre sur le début du code postal
  const localisationPart = `codePostalEtablissement:${departement}*`;

  return [nafPart, effectifPart, localisationPart].join(" AND ");
}

function formatEtab(etab) {
  const adr = etab.adresseEtablissement || {};
  const ul = etab.uniteLegale || {};
  const periode = (etab.periodesEtablissement || [])[0] || {};

  return {
    siret: etab.siret,
    siren: etab.siren,
    nom: ul.denominationUniteLegale,
    activite: ul.activitePrincipaleUniteLegale,
    enseigne: periode.denominationUsuelleEtablissement || null,
    adresse: `${adr.numeroVoieEtablissement || ""} ${adr.typeVoieEtablissement || ""} ${adr.libelleVoieEtablissement || ""}`.trim(),
    codePostal: adr.codePostalEtablissement,
    ville: adr.libelleCommuneEtablissement,
    trancheEffectifs: ul.trancheEffectifsUniteLegale,
    etatEtablissement: periode.etatAdministratifEtablissement, // A = actif, F = fermé
  };
}

async function main() {
  const departement = "75"; // 👈 ICI : tu peux changer facilement

  const query = buildQuery({ departement });
  console.log("Requête Sirene :", query);

  const allRows = [];

  await client.paginateSearch(
    "siret",
    query,
    { pageSize: 100, maxResults: 1000 }, // par ex : 1000 prospects max
    async (page) => {
      const etabs = page.etablissements || [];
      const formatted = etabs.map(formatEtab);

      // Option : ne garder que les établissements ACTIFS
      const actifs = formatted.filter(
        (e) => e.etatEtablissement === "A"
      );

      allRows.push(...actifs);
      console.log(
        "Page reçue :", etabs.length, "bruts →", actifs.length, "actifs"
      );
    }
  );

  console.log("Total prospects actifs :", allRows.length);

  // 👉 Génération du JSON au lieu du CSV
  const output = {
    departement,
    total: allRows.length,
    prospects: allRows,
  };

  fs.writeFileSync(
    `prospects_seminaires_dep${departement}.json`,
    JSON.stringify(output, null, 2),
    "utf8"
  );

  console.log(
    `Fichier généré : prospects_seminaires_dep${departement}.json`
  );
}

main().catch((err) => {
  console.error("Erreur globale :", err.status, err.body || err.message);
});
