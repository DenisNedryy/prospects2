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
            this.generateDetailsDepartments(el, dep);
            this.borderlineTheDepartment(target);
        }

        // Click sur le bouton d'enrichissement
        const btn = document.querySelector(".btn-enrichissement");
        if (btn && e.target === btn) {
            e.preventDefault();
            const container = e.target.closest('.home__main');

            if (!container) return;
            const select = container.querySelector('#filterType');
            if (!select) return;
            this.controller.sounds.play('dubStep');
            await this.operationSiren(this.dep);
            this.controller.sounds.stop('dubStep');
            this.stopWhitePolygon(this.dep)
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
        const { x, y } = this.getCentroid(points);

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


    async loadSirenMap() {
        // afficher la map pour le siren
        // fetch des values pour table entreprises
        console.log("siren select change");
        const res = await this.controller.entreprise.getSirenDepLength();
        console.log(res);
        const entreprises = res.data;
        // on recolorise la carte selon la length
        this.operationRecolorisation(entreprises);
    }

    getCentroid(pointsStr) {
        const nums = pointsStr
            .trim()
            .split(/[ ,]+/)
            .map(n => parseFloat(n));

        let xSum = 0;
        let ySum = 0;
        let count = 0;

        for (let i = 0; i < nums.length; i += 2) {
            xSum += nums[i];
            ySum += nums[i + 1];
            count++;
        }

        return {
            x: xSum / count,
            y: ySum / count
        };
    }

    async generateDetailsDepartments(el, dep) {
        // S'assurer que les départements sont chargés
        const departments = await this.loadDepartments();

        const sirenRes = await this.controller.entreprise.getSirenPerDep(dep);
        const sirenCount = sirenRes.count;

        el.innerHTML = "";

        // titre
        const title = document.createElement('h2');
        title.textContent = `Détails départements: ${departments[dep]}-${dep}`;
        el.appendChild(title);

        // legend
        const legend = document.createElement('p');
        legend.textContent = `Total siren trouvé: ${sirenCount}`;
        el.appendChild(legend);

        // link to crm
        if (sirenCount > 0) {
            const crma = document.createElement('a');
            crma.setAttribute('data-link', ``);
            crma.setAttribute('href', `/data?dep=${dep}`)
            const crmBtn = document.createElement('button');
            crmBtn.className = "btn btn-data";
            crmBtn.textContent = "Data";
            crma.appendChild(crmBtn);
            el.appendChild(crma);
        }


        // sous titre
        const subTitle = document.createElement('h3');
        subTitle.textContent = "Récupération des données";
        el.appendChild(subTitle);

        // btn submit
        const btn = document.createElement('button');
        btn.textContent = "Lancer l'enrichissement du département";
        btn.className = "btn-enrichissement btn";
        el.appendChild(btn);

        // ligne d'information
        const infoDiv = document.createElement('div');
        infoDiv.className = "details__phraseRassurante";
        el.appendChild(infoDiv);
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

    borderlineTheDepartment(target) {
        document.querySelectorAll('.selected').forEach((el) => el.classList.remove('selected'));
        target.classList.add('selected');
    }

    operationRecolorisation(data) {
        if (!data) return;
        const polygons = document.querySelectorAll('polygon');
        polygons.forEach((polygon) => {
            const dep = polygon.getAttribute('data-dep');
            const sameData = data.find((cell) => Number(cell.dep) === Number(dep));
            if (sameData.length === 0) {
                polygon.classList.add('polygon-white');
            }
        })
    }

    stopWhitePolygon(dep) {
        const polygons = document.querySelectorAll('polygon');
        polygons.forEach((polygon) => {
            const depPoly = polygon.getAttribute('data-dep');

            if (Number(depPoly) === Number(dep)) {
                polygon.classList.remove('polygon-white');
            }
        })
    }
}
