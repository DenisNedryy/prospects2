const PAPPERS_BASE_URL = process.env.PAPPERS_BASE_URL || "https://api.pappers.fr/v2";

exports.getPappersQuota = async (req, res) => {
  try {
    if (!process.env.PAPPERS_API_KEY) {
      return res.status(400).json({ error: "PAPPERS_API_KEY manquant" });
    }

    const url = new URL(`${PAPPERS_BASE_URL}/suivi-jetons`);
    url.searchParams.set("api_token", process.env.PAPPERS_API_KEY);

    const r = await fetch(url.toString());
    const body = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: "Erreur suivi jetons Pappers",
        details: body,
      });
    }

    return res.status(200).json({ data: body });
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) });
  }
};
exports.getDropContactQuota = async (req, res) => {
  try {
    const apiKey = process.env.DROPCONTACT_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "DROPCONTACT_API_KEY manquant" });
    }

    // Endpoint officiel + méthode officielle
    const r = await fetch("https://api.dropcontact.com/v1/enrich/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": apiKey,
        "Accept": "application/json",
      },
      // payload minimal pour obtenir credits_left
      body: JSON.stringify({ data: [{}] }),
    });

    const text = await r.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(r.status).json({ error: "Réponse Dropcontact non JSON", raw: text });
    }

    if (!r.ok) {
      return res.status(r.status).json({ error: "Erreur quota Dropcontact", details: data });
    }

    // data.credits_left est ce que tu veux afficher
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) });
  }
};
