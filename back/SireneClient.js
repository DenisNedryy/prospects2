// sireneClient.js
class SireneClient {
  constructor({ apiKey, baseUrl = "https://api.insee.fr/api-sirene/3.11" }) {
    if (!apiKey) throw new Error("SireneClient: 'apiKey' est obligatoire.");
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  _buildUrl(path, params = {}) {
    const url = new URL(this.baseUrl + path);
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) search.append(key, value);
    }

    if ([...search].length > 0) {
      url.search = search.toString();
    }

    return url.toString();
  }

  async _request(path, { params = {}, method = "GET" } = {}) {
    const url = this._buildUrl(path, params);

    const response = await fetch(url, {
      method,
      headers: {
        "X-INSEE-Api-Key-Integration": this.apiKey,
        Accept: "application/json",
      },
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (!response.ok) {
      const err = new Error("Erreur API Sirene");
      err.status = response.status;
      err.body = json || text;
      throw err;
    }

    return json;
  }

  searchEtablissements(query, { limit = 20, start = 0 } = {}) {
    return this._request("/siret", {
      params: { q: query, nombre: limit, debut: start },
    });
  }

  async paginateSearch(type, query, { pageSize = 100, maxResults = 1000 }, onPage) {
    if (type !== "siret") throw new Error("paginateSearch ne gère que 'siret' ici");

    let start = 0;
    let total = 0;

    while (total < maxResults) {
      const res = await this.searchEtablissements(query, {
        limit: Math.min(pageSize, maxResults - total),
        start,
      });

      await onPage(res);

      const nb = res?.header?.nombre || res?.nombre || 0;
      if (!nb) break;

      start += nb;
      total += nb;

      if (nb < pageSize) break;
    }
  }
}

module.exports = SireneClient;
