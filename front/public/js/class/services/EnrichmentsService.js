import { apiFetch } from "./http.js";

export class EnrichmentsService {
  runPappers(limit = 25) {
    return apiFetch("/api/enrichments/pappers/run", {
      method: "POST",
      body: { limit },
      timeoutMs: 60000,
    });
  }

  runDropcontact(limit = 25) {
    return apiFetch("/api/enrichments/dropcontact/run", {
      method: "POST",
      body: { limit },
      timeoutMs: 120000, // Dropcontact peut poll
    });
  }
}
