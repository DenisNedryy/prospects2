// sireneClient.js
// Client minimal pour l'API Sirene (INSEE) avec fetch (Node 18+)

export class SireneClient {
  /**
   * @param {Object} options
   * @param {string} options.apiKey  Clé d’API INSEE (plan "api key")
   * @param {string} [options.baseUrl] URL de base de l'API Sirene
   */
  constructor({ apiKey, baseUrl = "https://api.insee.fr/api-sirene/3.11" }) {
    if (!apiKey) {
      throw new Error("SireneClient: 'apiKey' est obligatoire.");
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, ""); // remove trailing slash
  }

  // ---------- Helpers privés ----------

  /**
   * Construit une URL avec query params
   * @param {string} path
   * @param {Object} [params]
   * @returns {string}
   */
  _buildUrl(path, params = {}) {
    const url = new URL(this.baseUrl + path);
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      search.append(key, String(value));
    });

    const qs = search.toString();
    if (qs) url.search = qs;
    return url.toString();
  }

  /**
   * Envoie une requête à l'API Sirene
   * @param {string} path
   * @param {Object} [options]
   * @param {Object} [options.params]  Query params
   * @param {string} [options.method]  Méthode HTTP
   */
  async _request(path, { params = {}, method = "GET" } = {}) {
    const url = this._buildUrl(path, params);

    const response = await fetch(url, {
      method,
      headers: {
        "X-INSEE-Api-Key-Integration": this.apiKey,
        "Accept": "application/json",
      },
    });

    const text = await response.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    if (!response.ok) {
      const error = new Error(
        `Erreur API Sirene ${response.status} ${response.statusText}`
      );
      error.status = response.status;
      error.body = json || text;
      throw error;
    }

    return json;
  }

  // ---------- Méthodes publiques ----------

  /**
   * Récupère une unité légale par SIREN
   * @param {string} siren - 9 chiffres
   */
  async getUniteLegaleBySiren(siren) {
    if (!siren) throw new Error("getUniteLegaleBySiren: 'siren' est requis.");
    return this._request(`/siren/${siren}`);
  }

  /**
   * Récupère un établissement par SIRET
   * @param {string} siret - 14 chiffres
   */
  async getEtablissementBySiret(siret) {
    if (!siret) throw new Error("getEtablissementBySiret: 'siret' est requis.");
    return this._request(`/siret/${siret}`);
  }

  /**
   * Recherche d’unités légales (entreprises) via le paramètre q
   * @param {string} query  Ex: 'denominationUniteLegale:BOULANGERIE'
   * @param {Object} [options]
   * @param {number} [options.limit=20] Nombre de résultats (paramètre 'nombre')
   * @param {number} [options.start=0]  Offset de départ (paramètre 'debut')
   */
  async searchUnitesLegales(query, { limit = 20, start = 0 } = {}) {
    if (!query) throw new Error("searchUnitesLegales: 'query' est requis.");
    return this._request("/siren", {
      params: {
        q: query,
        nombre: limit,
        debut: start,
      },
    });
  }

  /**
   * Recherche d’établissements (SIRET) via le paramètre q
   * @param {string} query  Ex: 'denominationUniteLegale:BOULANGERIE AND codePostalEtablissement:75001'
   * @param {Object} [options]
   * @param {number} [options.limit=20] Nombre de résultats
   * @param {number} [options.start=0]  Offset de départ
   */
  async searchEtablissements(query, { limit = 20, start = 0 } = {}) {
    if (!query) throw new Error("searchEtablissements: 'query' est requis.");
    return this._request("/siret", {
      params: {
        q: query,
        nombre: limit,
        debut: start,
      },
    });
  }

  /**
   * Helper pour paginer "simplement" : itère jusqu'à n résultats max
   * et applique un callback sur chaque page.
   *
   * @param {"siren"|"siret"} type            Type de ressource
   * @param {string} query                    Requête q=
   * @param {Object} [options]
   * @param {number} [options.pageSize=100]   Nombre de résultats par page
   * @param {number} [options.maxResults=1000]Nombre total max à récupérer
   * @param {(page:any)=>Promise<void>|void} onPage Callback appelée à chaque page
   */
  async paginateSearch(type, query, { pageSize = 100, maxResults = 1000 }, onPage) {
    if (!["siren", "siret"].includes(type)) {
      throw new Error("paginateSearch: type doit être 'siren' ou 'siret'.");
    }
    if (!query) throw new Error("paginateSearch: 'query' est requis.");
    if (typeof onPage !== "function") {
      throw new Error("paginateSearch: 'onPage' doit être une fonction.");
    }

    let start = 0;
    let totalFetched = 0;

    while (totalFetched < maxResults) {
      const res =
        type === "siren"
          ? await this.searchUnitesLegales(query, {
              limit: Math.min(pageSize, maxResults - totalFetched),
              start,
            })
          : await this.searchEtablissements(query, {
              limit: Math.min(pageSize, maxResults - totalFetched),
              start,
            });

      await onPage(res);

      const nbReturned =
        res?.header?.nombre || res?.nombre || 0; // selon la structure renvoyée
      if (!nbReturned) break;

      totalFetched += nbReturned;
      start += nbReturned;

      // Si l'API renvoie moins que la page demandée, c'est fini
      if (nbReturned < pageSize) break;
    }
  }
}
