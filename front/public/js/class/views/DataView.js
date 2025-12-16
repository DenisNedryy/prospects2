export class DataView {
  escapeHtml(v) {
    return String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  buildAddress(p) {
    const adresse = p.adresse || "";
    const cp = p.codePostal || "";
    const ville = p.ville || "";
    const parts = [adresse, `${cp} ${ville}`.trim()].filter(Boolean);
    return parts.join(", ");
  }

  isActive(p) {
    const s = String(p.etatEtablissement || "").toUpperCase();
    return s === "A" || s === "ACTIVE" || s === "ACTIF" || s === "1" || s === "TRUE";
  }

  // payload attendu = { query, page, limit, total, totalPages, data: [...] }
  render(payload = {}) {
    const el = document.getElementById("root");
    if (!el) return;

    const {
      data = [],
      page = 1,
      totalPages = 1,
      query = ""
    } = payload;

    const rows = (Array.isArray(data) ? data : []).map((p) => {
      const active = this.isActive(p);
      const statusClass = active ? "statusDot--active" : "statusDot--inactive";
      const statusLabel = active ? "Actif" : "Inactif";

      const dep = this.escapeHtml(p.dep || p.departement || "");
      const nom = this.escapeHtml(p.nom || p.nomEntreprise || "");
      const siren = this.escapeHtml(p.siren || "");
      const address = this.escapeHtml(this.buildAddress(p));

      const dirNom = this.escapeHtml(
        (p.dirigeant && p.dirigeant.nom_complet) ||
        p.nom_dirigeant ||
        p.dirigeant ||
        ""
      );

      const dirFonction = this.escapeHtml(
        (p.dirigeant && p.dirigeant.fonction) ||
        p.fonction_dirigeant ||
        ""
      );

      const emailRaw =
        p.email ||
        (p.emails && p.emails[0] && p.emails[0].email) ||
        (p.emails && p.emails[0]) ||
        p.email_dirigeant ||
        "";

      const email = this.escapeHtml(emailRaw);
      const mailCell = email
        ? `<a class="mailLink" href="mailto:${email}">${email}</a>`
        : `<span class="muted">—</span>`;

      return `
        <li class="dataItem">
          <div class="cell statusCell">
            <span class="statusDot ${statusClass}"></span>
            <span class="statusLabel">${statusLabel}</span>
          </div>

          <div class="cell mono">${dep || "—"}</div>

          <div class="cell">
            <div class="strong">${nom || "—"}</div>
            <div class="muted small">${siren ? `SIREN: ${siren}` : ""}</div>
          </div>

          <div class="cell">
            <div class="ellipsis">${address || "—"}</div>
          </div>

          <div class="cell">
            <div class="strong">${dirNom || "—"}</div>
            <div class="muted small">${dirFonction || ""}</div>
          </div>

          <div class="cell">
            ${mailCell}
          </div>
        </li>
      `;
    }).join("");

    // Pagination (simple) : affiche toutes les pages
    const pagination = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1)
      .map((p) => {
        const activeClass = p === page ? "square--active" : "";
        return `<button class="square ${activeClass}" data-page="${p}" type="button">${p}</button>`;
      })
      .join("");

    el.innerHTML = `
      <div class="searchBar">
        <form id="searchBar-form">
          <input type="text" name="query" placeholder="Insert query" value="${this.escapeHtml(query)}"/>
          <button type="submit">Submit</button>
        </form>
      </div>

      <div class="pagination pagination--top">
        <button id="prevPage" type="button" ${page <= 1 ? "disabled" : ""}>← Précédent</button>
        <span class="muted">Page ${page} / ${Math.max(1, totalPages)}</span>
        <button id="nextPage" type="button" ${page >= totalPages ? "disabled" : ""}>Suivant →</button>
      </div>

      <ul class="dataList">
        <li class="dataItem dataItem--head">
          <div>Statut</div>
          <div>Dép.</div>
          <div>Entreprise</div>
          <div>Adresse</div>
          <div>Dirigeant</div>
          <div>Email</div>
        </li>

        ${rows || `
          <li class="dataItem">
            <div class="cell" style="grid-column:1/-1">
              <span class="muted">Aucun résultat</span>
            </div>
          </li>
        `}
      </ul>

      <div class="pagination pagination--bottom">
        ${pagination}
      </div>
    `;

    const setPageInUrl = (newPage, newQuery = query) => {
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(newPage));
      if (newQuery && String(newQuery).trim()) url.searchParams.set("query", String(newQuery).trim());
      else url.searchParams.delete("query");
      window.location.href = url.toString();
    };

    // Boutons prev/next
    document.getElementById("prevPage")?.addEventListener("click", () => setPageInUrl(page - 1));
    document.getElementById("nextPage")?.addEventListener("click", () => setPageInUrl(page + 1));

    // Boutons numérotés
    el.querySelectorAll(".square[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = parseInt(btn.getAttribute("data-page"), 10);
        if (!Number.isNaN(p)) setPageInUrl(p);
      });
    });

    // Form recherche => page 1
    const form = document.getElementById("searchBar-form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const q = String(fd.get("query") || "").trim();
      setPageInUrl(1, q);
    });
  }
}
