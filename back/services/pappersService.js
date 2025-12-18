// services/pappersService.js
const PAPPERS_API_KEY = process.env.PAPPERS_API_KEY;
const PAPPERS_BASE_URL =
  process.env.PAPPERS_BASE_URL || "https://api.pappers.fr/v2";

function assertKey() {
  if (!PAPPERS_API_KEY) {
    throw new Error("PAPPERS_API_KEY manquant");
  }
}

function cleanStr(v) {
  return String(v || "").trim();
}

/**
 * Appel Pappers entreprise par SIREN
 * @returns tableau de dirigeants normalisés
 * [{ firstname, lastname, fonction }]
 */
async function fetchDirigeantsBySiren(siren) {
  assertKey();
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
    throw new Error(`Pappers HTTP ${r.status}: ${text.slice(0, 200)}`);
  }

  // ⚠️ mapping selon API Pappers (v2)
  const reps =
    json?.representants ||
    json?.dirigeants ||
    json?.beneficiaires_effectifs ||
    [];

  return reps
    .map((r) => ({
      firstname: cleanStr(r?.prenom || r?.first_name),
      lastname: cleanStr(r?.nom || r?.last_name),
      fonction: cleanStr(r?.qualite || r?.fonction) || null,
    }))
    .filter((d) => d.firstname && d.lastname);
}

module.exports = {
  fetchDirigeantsBySiren,
};
