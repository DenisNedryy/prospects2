import { apiFetch } from "./http.js";

export class EntreprisesService {
  createSiren(dep) {
    return apiFetch("/api/entreprises/siren", {
      method: "POST",
      body: { dep },
      timeoutMs: 60000, // l’import Sirene peut être long
    });
  }

  // optionnel : tu peux ajouter des stats plus tard si tu crées les routes
  // getStatsByDepartement() { ... }
}
