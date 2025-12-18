// services/dropcontactService.js
// Implémentation Dropcontact API v1 enrich/all (POST + GET request_id)
//
// Docs: POST /v1/enrich/all puis GET /v1/enrich/all/{request_id}
// Auth: header "X-Access-Token"

const DROP_API_KEY = process.env.DROPCONTACT_API_KEY;
const DROP_BASE_URL = process.env.DROPCONTACT_BASE_URL || "https://api.dropcontact.com/v1/enrich";
const DROP_LANGUAGE = process.env.DROPCONTACT_LANGUAGE || "fr";

// polling
const DEFAULT_POLL_MAX_TRIES = Number(process.env.DROPCONTACT_POLL_MAX_TRIES || 10);
const DEFAULT_POLL_DELAY_MS = Number(process.env.DROPCONTACT_POLL_DELAY_MS || 2500);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function assertKey() {
  if (!DROP_API_KEY) throw new Error("DROPCONTACT_API_KEY manquant");
}

async function postEnrichAll(dataArray) {
  assertKey();

  const r = await fetch(`${DROP_BASE_URL}/all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Token": DROP_API_KEY,
    },
    body: JSON.stringify({
      data: dataArray,
      siren: false,          // tu peux le passer à true si tu veux + d’infos société
      language: DROP_LANGUAGE,
    }),
  });

  const text = await r.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }

  if (!r.ok) {
    throw new Error(`Dropcontact POST HTTP ${r.status}: ${text.slice(0, 200)}`);
  }
  if (!json?.success || !json?.request_id) {
    throw new Error(`Dropcontact POST: réponse inattendue: ${text.slice(0, 200)}`);
  }
  return json.request_id;
}

async function getEnrichAll(requestId) {
  assertKey();

  const r = await fetch(`${DROP_BASE_URL}/all/${encodeURIComponent(requestId)}`, {
    method: "GET",
    headers: {
      "X-Access-Token": DROP_API_KEY,
    },
  });

  const text = await r.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }

  if (!r.ok) {
    throw new Error(`Dropcontact GET HTTP ${r.status}: ${text.slice(0, 200)}`);
  }
  return json;
}

function pickBestEmail(emailArray) {
  // email: [{ email: "...", qualification: "nominative@pro" }, ...]
  if (!Array.isArray(emailArray) || emailArray.length === 0) return null;

  const score = (q) => {
    // priorité: nominative@pro > nominative@catch_all/pro > generic@pro > catch_all@pro > autres > invalid
    if (!q) return 0;
    const s = String(q).toLowerCase();

    if (s === "nominative@pro") return 100;
    if (s.startsWith("nominative@")) return 90;

    if (s === "generic@pro") return 70;
    if (s.startsWith("generic@")) return 60;

    if (s === "catch_all@pro") return 50;
    if (s.includes("@pro")) return 40;

    if (s.includes("invalid")) return -10;
    return 10;
  };

  const sorted = [...emailArray]
    .filter((e) => e?.email)
    .sort((a, b) => score(b?.qualification) - score(a?.qualification));

  return sorted[0]?.email || null;
}

function buildDropcontactInput(payload) {
  // Dropcontact demande des combinaisons valides :
  // - first_name + last_name + company (ou full_name + company)
  // - ou linkedin
  // - ou email
  // On va fournir les meilleures infos dispo.

  if (payload?.type === "ENTREPRISE") {
    const ent = payload.entreprise || {};
    // Pour une entreprise “sans personne”, Dropcontact est moins efficace.
    // On peut quand même essayer avec company + website si dispo,
    // mais idéalement tu enrichis plutôt des dirigeants (DIRIGEANT).
    // Ici, on envoie au minimum company.
    return {
      company: ent.denomination || undefined,
      // Optionnel: website si tu l’as (tu ne l’as pas dans ta table actuellement)
      // website: ent.website || undefined,
      num_siren: ent.siren || undefined,
      custom_fields: {
        _entity_type: "ENTREPRISE",
        _entreprise_id: String(ent.id || ""),
      },
    };
  }

  if (payload?.type === "DIRIGEANT") {
    const ent = payload.entreprise || {};
    const d = payload.dirigeant || {};

    return {
      first_name: d.firstname || undefined,
      last_name: d.lastname || undefined,
      company: ent.denomination || undefined,
      num_siren: ent.siren || undefined,
      job: d.fonction || undefined,
      custom_fields: {
        _entity_type: "DIRIGEANT",
        _dirigeant_id: String(d.id || ""),
        _entreprise_id: String(ent.id || ""),
      },
    };
  }

  throw new Error("Dropcontact: payload.type invalide");
}

/**
 * enrichDropcontact(payload)
 * @returns {Promise<{status:"FOUND"|"NOT_FOUND", email?:string, provider_ref?:string}>}
 */
async function enrichDropcontact(payload, opts = {}) {
  const pollMaxTries = opts.pollMaxTries ?? DEFAULT_POLL_MAX_TRIES;
  const pollDelayMs = opts.pollDelayMs ?? DEFAULT_POLL_DELAY_MS;

  const input = buildDropcontactInput(payload);

  // Dropcontact accepte un tableau de "data" (batch).
  const requestId = await postEnrichAll([input]);

  // Polling GET jusqu’à résultat prêt
  for (let i = 0; i < pollMaxTries; i++) {
    const out = await getEnrichAll(requestId);

    // "success: false" + reason => encore en cours
    if (out?.success === false && out?.reason) {
      await sleep(pollDelayMs);
      continue;
    }

    // terminé
    const first = Array.isArray(out?.data) ? out.data[0] : null;
    const email = pickBestEmail(first?.email);

    if (email) {
      return { status: "FOUND", email, provider_ref: requestId };
    }
    return { status: "NOT_FOUND", provider_ref: requestId };
  }

  // timeout polling
  // (Tu pourrais décider de mettre ERROR + retry côté controller)
  throw new Error(`Dropcontact: résultat non prêt après ${pollMaxTries} essais (request_id=${requestId})`);
}

module.exports = { enrichDropcontact };
