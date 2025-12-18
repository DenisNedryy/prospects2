export class HomeEB {
    constructor() {
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleMouseOver = this.handleMouseOver.bind(this);
        this.boundHandleMouseOut = this.handleMouseOut.bind(this);
        this.boundHandleChange = this.handleChange.bind(this);

        this.departments = null;              // cache
        this.departmentsPromise = null;       // pour éviter double fetch
        this.dep = null;
        this.svg = null;
        this.label = null;
    }

    setController(controller) {
        this.controller = controller;
    }

    addEventListeners() {
        document.removeEventListener('click', this.boundHandleClick);
        document.addEventListener('click', this.boundHandleClick);

        document.removeEventListener('mouseover', this.boundHandleMouseOver);
        document.addEventListener('mouseover', this.boundHandleMouseOver);

        document.removeEventListener('mouseout', this.boundHandleMouseOut);
        document.addEventListener('mouseout', this.boundHandleMouseOut);

        document.removeEventListener('change', this.boundHandleChange);
        document.addEventListener('change', this.boundHandleChange);
    }

    initBase() {
        const svg = document.querySelector('.carte-france svg');
        if (!svg) {
            this.svg = null;
            this.label = null;
            return;
        }

        this.svg = svg;

        const svgNS = "http://www.w3.org/2000/svg";

        // Essayer de retrouver un label déjà présent dans ce SVG
        let label = svg.querySelector('#dep-label');

        // Sinon, en créer un nouveau
        if (!label) {
            label = document.createElementNS(svgNS, 'text');
            label.setAttribute('id', 'dep-label');
            label.setAttribute('visibility', 'hidden');
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '14');
            label.setAttribute('fill', 'black');
            label.setAttribute('class', 'map_legend');
            svg.appendChild(label);
        }

        this.label = label;
    }

    async loadDepartments() {
        if (this.departments) return this.departments;

        if (!this.departmentsPromise) {
            this.departmentsPromise = fetch("../../../../public/data/departments.json")
                .then(r => r.json())
                .then(json => {
                    this.departments = json;
                    return json;
                })
                .catch(err => {
                    console.error("Erreur chargement departments.json", err);
                    this.departments = {};
                    return this.departments;
                });
        }

        return this.departmentsPromise;
    }

    async handleClick(e) {
        const target = e.target;

        // Click sur un département de la carte
        if (target instanceof SVGPolygonElement && target.closest('.carte-france')) {
            const dep = target.getAttribute('data-dep');
            this.dep = dep;
            const el = document.querySelector(".home__main__details__body");
            if (!el) return;
            const departments = await this.loadDepartments();
            // generateDetailsDepartments(el, dep, departments, emailsSent)
            this.controller.homeView.generateDetailsDepartments(el, dep, departments);
            this.controller.homeView.borderlineTheDepartment(target);
        }

        // Click sur le bouton d'enrichissement
        const btn = document.querySelector(".btn-enrichissement");
        if (btn && e.target === btn) {
            e.preventDefault();
            const container = e.target.closest('.home__main');

            if (!container) return;
            this.controller.sounds.play('dubStep');
            // await this.operationSiren(this.dep);
            await this.operationProspection(this.dep);
            this.controller.sounds.stop('dubStep');
            this.controller.homeView.stopWhitePolygon(this.dep)
        }
    }

    async handleMouseOver(e) {
        const target = e.target;
        if (!(target instanceof SVGPolygonElement) || !target.closest('.carte-france')) return;

        // (Re)init si pas de label OU si le label n'est plus dans le DOM
        if (!this.label || !document.body.contains(this.label)) {
            this.initBase();
            if (!this.label) return;
        }

        const dep = target.getAttribute('data-dep') || '';
        const points = target.getAttribute('points') || '';
        const { x, y } = this.controller.maps.getCentroid(points);

        this.label.setAttribute('x', String(x));
        this.label.setAttribute('y', String(y - 25));

        const departments = await this.loadDepartments();
        this.label.textContent = `${departments[dep] ?? 'Inconnu'}-${dep}`;
        this.label.setAttribute('visibility', 'visible');
    }

    async handleMouseOut(e) {
        const target = e.target;
        if (!(target instanceof SVGPolygonElement) || !target.closest('.carte-france')) return;
        if (!this.label) return;

        this.label.setAttribute('visibility', 'hidden');
    }

    async handleChange(e) {

    }

    async operationProspection(dep) {
        console.log("operation prospection en lancé");
        const data = { total: 25 };
        this.controller.homeView.resetApiRender();

        // récupération des siren
        this.controller.homeView.renderOperationEnCours("sirene");
        const sirenes = await this.controller.entreprise.createSiren(dep);
        console.log(sirenes);
        this.controller.homeView.renderSiren("sirene", sirenes);
        // await new Promise(async (resolve) => {
        //     const sirenes = await this.controller.entreprise.createSiren(dep);
        //     this.controller.homeView.renderOperationEnCours("sirene");
        //     setTimeout(() => {
        //         this.controller.homeView.renderSiren("sirene", sirenes);
        //         resolve();
        //     }, 3000);
        // });

        // enrichissement via pappers
        await new Promise((resolve) => {
            this.controller.homeView.renderOperationEnCours("pappers");
            setTimeout(() => {
                this.controller.homeView.renderSiren("pappers", data);
                resolve();
            }, 3000);
        });

        // enrichissement via dropContact
        await new Promise((resolve) => {
            this.controller.homeView.renderOperationEnCours("dropContact");
            setTimeout(() => {
                this.controller.homeView.renderSiren("dropContact", data);
                resolve();
            }, 3000);
        });
    }


    async operationSiren(dep) {
        const el = document.querySelector(".details__phraseRassurante");
        if (!el) return;

        // afficher qu'on fetch les données
        el.innerHTML = `<i class="fa-solid fa-gear rotating"></i><p>Opération en cours ...</p>`;

        // fetch l'api
        const res = await this.controller.entreprise.createSiren(dep);
        console.log(res);
        el.innerHTML = `<i class="fa-solid fa-circle-check"></i><p>SIRENE: ${res.total} entreprises récupérées au total</p>`;
        await this.loadSirenMap();
    }



    // async loadSirenMap() {
    //     // afficher la map pour le siren
    //     // fetch des values pour table entreprises
    //     console.log("siren select change");
    //     const res = await this.controller.entreprise.getSirenDepLength();
    //     console.log(res);
    //     const entreprises = res.data;
    //     // on recolorise la carte selon la length
    //     this.operationRecolorisation(entreprises);
    // }

}
