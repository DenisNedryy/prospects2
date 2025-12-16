// services/sireneEntreprisesService.js
const SireneClient = require("../SireneClient");

const client = new SireneClient({
  apiKey: process.env.SIRENE_API_KEY,
});

const nafCodes = [
  "70.10Z", "70.22Z", "73.11Z", "73.20Z",
  "82.30Z", "85.59A", "85.59B"
];

const effectifTranches = ["11", "12", "21", "22", "31"];

function buildQuery(departement) {
  const nafPart = "(" + nafCodes.map(c => `activitePrincipaleUniteLegale:${c}`).join(" OR ") + ")";
  const effectifPart = "(" + effectifTranches.map(t => `trancheEffectifsUniteLegale:${t}`).join(" OR ") + ")";
  const localisationPart = `codePostalEtablissement:${departement}*`;
  return `${nafPart} AND ${effectifPart} AND ${localisationPart}`;
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
    adresse: `${adr.numeroVoieEtablissement || ""} ${adr.typeVoieEtablissement || ""} ${adr.libelleVoieEtablissement || ""}`.trim(),
    codePostal: adr.codePostalEtablissement,
    ville: adr.libelleCommuneEtablissement,
    trancheEffectifs: ul.trancheEffectifsUniteLegale,
    etatEtablissement: periode.etatAdministratifEtablissement,
  };
}

async function fetchEntreprisesForDepartement(departement, maxResults = 1000) {
  const query = buildQuery(departement);
  const all = [];

  await client.paginateSearch(
    "siret",
    query,
    { pageSize: 100, maxResults },
    async (page) => {
      const etabs = page.etablissements || [];
      const formatted = etabs.map(formatEtab);
      const actifs = formatted.filter(x => x.etatEtablissement === "A");
      all.push(...actifs);
    }
  );

  return all;
}

module.exports = fetchEntreprisesForDepartement;
