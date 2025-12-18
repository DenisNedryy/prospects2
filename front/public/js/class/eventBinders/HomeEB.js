export class HomeEB {
  constructor() {
    this.boundHandleClick = this.handleClick.bind(this);
    this.boundHandleMouseOver = this.handleMouseOver.bind(this);
    this.boundHandleMouseOut = this.handleMouseOut.bind(this);
    this.boundHandleChange = this.handleChange.bind(this);

    this.departments = null;
    this.departmentsPromise = null;
    this.dep = null;
    this.svg = null;
    this.label = null;
  }

  setController(controller) {
    this.controller = controller;
  }

  addEventListeners() {
    document.removeEventListener("click", this.boundHandleClick);
    document.addEventListener("click", this.boundHandleClick);

    document.removeEventListener("mouseover", this.boundHandleMouseOver);
    document.addEventListener("mouseover", this.boundHandleMouseOver);

    document.removeEventListener("mouseout", this.boundHandleMouseOut);
    document.addEventListener("mouseout", this.boundHandleMouseOut);

    document.removeEventListener("change", this.boundHandleChange);
    document.addEventListener("change", this.boundHandleChange);
  }

  initBase() {
    const svg = document.querySelector(".carte-france svg");
    if (!svg) {
      this.svg = null;
      this.label = null;
      return;
    }

    this.svg = svg;
    const svgNS = "http://www.w3.org/2000/svg";

    let label = svg.querySelector("#dep-label");
    if (!label) {
      label = document.createElementNS(svgNS, "text");
      label.setAttribute("id", "dep-label");
      label.setAttribute("visibility", "hidden");
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "14");
      label.setAttribute("fill", "black");
      label.setAttribute("class", "map_legend");
      svg.appendChild(label);
    }

    this.label = label;
  }

  async loadDepartments() {
    if (this.departments) return this.departments;

    if (!this.departmentsPromise) {
      this.departmentsPromise = fetch("../../../../public/data/departments.json")
        .then((r) => r.json())
        .then((json) => {
          this.departments = json;
          return json;
        })
        .catch((err) => {
          console.error("Erreur chargement departments.json", err);
          this.departments = {};
          return this.departments;
        });
    }

    return this.departmentsPromise;
  }

  async handleClick(e) {
    const target = e.target;

    // quotas
    const btnQuota = e.target.closest('.btn-quota');
    if(btnQuota){
      const pappersPreRes = await this.controller.quotaService.getPappersQuota();
      console.log(pappersPreRes);
      const dropContactPreRes = await this.controller.quotaService.getDropContactQuota();
      console.log(dropContactPreRes);
    }

    // Click sur un département de la carte
    if (target instanceof SVGPolygonElement && target.closest(".carte-france")) {
      const dep = target.getAttribute("data-dep");
      this.dep = dep;

      const el = document.querySelector(".home__main__details__body");
      if (!el) return;

      const departments = await this.loadDepartments();
      this.controller.homeView.generateDetailsDepartments(el, dep, departments);
      this.controller.homeView.borderlineTheDepartment(target);
    }

    // Click sur le bouton d'enrichissement
    const btn = document.querySelector(".btn-enrichissement");
    if (btn && e.target === btn) {
      e.preventDefault();

      if (!this.dep) {
        // Optionnel: si tu as une méthode de toast/erreur côté view
        this.controller.homeView.renderSiren?.("sirene", { error: true, msg: "Sélectionne un département." });
        return;
      }

      const container = e.target.closest(".home__main");
      if (!container) return;

      this.controller.sounds.play("dubStep");
      try {
        await this.operationProspection(this.dep);
      } finally {
        this.controller.sounds.stop("dubStep");
        this.controller.homeView.stopWhitePolygon(this.dep);
      }
    }
  }

  async handleMouseOver(e) {
    const target = e.target;
    if (!(target instanceof SVGPolygonElement) || !target.closest(".carte-france")) return;

    if (!this.label || !document.body.contains(this.label)) {
      this.initBase();
      if (!this.label) return;
    }

    const dep = target.getAttribute("data-dep") || "";
    const points = target.getAttribute("points") || "";
    const { x, y } = this.controller.maps.getCentroid(points);

    this.label.setAttribute("x", String(x));
    this.label.setAttribute("y", String(y - 25));

    const departments = await this.loadDepartments();
    this.label.textContent = `${departments[dep] ?? "Inconnu"}-${dep}`;
    this.label.setAttribute("visibility", "visible");
  }

  async handleMouseOut(e) {
    const target = e.target;
    if (!(target instanceof SVGPolygonElement) || !target.closest(".carte-france")) return;
    if (!this.label) return;

    this.label.setAttribute("visibility", "hidden");
  }

  async handleChange(e) {}

  async operationProspection(dep) {
    this.controller.homeView.resetApiRender();

    // 1) SIRENE
    this.controller.homeView.renderOperationEnCours("sirene");
    const sirenes = await this.controller.entreprisesService.createSiren(dep);
    this.controller.homeView.renderSiren("sirene", sirenes);

    // 2) PAPPERS
    this.controller.homeView.renderOperationEnCours("pappers");
    const pappers = await this.controller.enrichmentsService.runPappers(25);
    this.controller.homeView.renderSiren("pappers", pappers);

    // 3) DROPCONTACT
    this.controller.homeView.renderOperationEnCours("dropContact");
    const drop = await this.controller.enrichmentsService.runDropcontact(25);
    this.controller.homeView.renderSiren("dropContact", drop);
  }
}
