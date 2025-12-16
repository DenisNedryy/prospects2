export class DataCtrl {
    constructor(seoManager, { views, eventBinders, services }) {
        this.seoManager = seoManager;
        this.dataView = views.dataView;
        this.dataEB = eventBinders.dataEB;
        this.entreprises = services.entreprises;

        this.dataEB.setController(this);
    }

    async show() {
        // Récupérer les paramètres de l'URL avec URLSearchParams
        const params = new URLSearchParams(window.location.search);
        
        const dep = params.get("dep") || null; // Valeur de "dep" (si présente)
        const query = params.get("query") || null; // Valeur de "query" (si présente)
        const page = parseInt(params.get("page")) || 1; // Valeur de "page", défaut à 1

        let entreprisesData;

        // Si un département (dep) est spécifié, on récupère les entreprises pour ce département
        if (dep) {
            entreprisesData = await this.entreprises.getEntreprisesByDep(dep, page); 
            console.log(entreprisesData);
        }
        // Si une requête de recherche est spécifiée
        else if (query) {
            entreprisesData = await this.entreprises.getEntreprisesByQuery(query, page);
        } 
        // Sinon, on récupère tous les entreprises avec pagination
        else {
            entreprisesData = await this.entreprises.getAllEntreprisesData(page);
        }


        // Afficher les données en fonction du paramètre (dep, query)
        this.dataView.render(entreprisesData); // Rendu des données récupérées

        // Mettre à jour le titre SEO
        this.seoManager.setTitle('Data | MailProspector');
        
        // Ajouter des écouteurs d'événements pour la pagination, etc.
        this.dataEB.addEventListeners();
    }
}
