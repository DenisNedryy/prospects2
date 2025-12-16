export class HomeCtrl {

    constructor(seoManager, { views, eventBinders, services }) {
        this.seoManager = seoManager;
        this.homeView = views.homeView;
        this.homeEB = eventBinders.homeEB;
        this.entreprise = services.entreprise;

        this.homeEB.setController(this);
    }

    show() {
        this.homeView.render();
        this.homeEB.loadSirenMap();
        this.seoManager.setTitle('Accueil | MailProspector');
        this.homeEB.addEventListeners();
    }
}