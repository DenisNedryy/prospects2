// pappersClient.js
export class PappersClient {
  constructor({ apiToken, baseUrl = "https://api.pappers.fr/v2" }) {
    if (!apiToken) throw new Error("PappersClient: 'apiToken' est obligatoire.");
    this.apiToken = apiToken;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  _buildUrl(path, params = {}) {
    const url = new URL(this.baseUrl + path);
    const search = new URLSearchParams({
      api_token: this.apiToken,
      ...params,
    });
    url.search = search.toString();
    return url.toString();
  }

  async _get(path, params = {}) {
    const url = this._buildUrl(path, params);
    const res = await fetch(url);
    const text = await res.text();

    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // JSON invalide / vide
    }

    if (!res.ok) {
      const err = new Error(`Erreur API Pappers ${res.status}`);
      err.status = res.status;
      err.body = json || text;
      throw err;
    }

    return json;
  }

  async getEntrepriseBySiren(siren) {
    if (!siren) throw new Error("getEntrepriseBySiren: 'siren' est requis.");
    return this._get("/entreprise", { siren });
  }

  async getEntrepriseBySiret(siret) {
    if (!siret) throw new Error("getEntrepriseBySiret: 'siret' est requis.");
    return this._get("/entreprise", { siret });
  }
}
