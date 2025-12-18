export class HomeCtrl {

    constructor(seoManager, { views, eventBinders, services, models, utils }) {
        this.seoManager = seoManager;
        this.homeView = views.homeView;
        this.homeEB = eventBinders.homeEB;
        this.entreprisesService = services.entreprisesService;
        this.enrichmentsService = services.enrichmentsService;
        this.quotaService = services.quotaService;
        this.sounds = utils.sounds;
        this.maps = models.maps;

        this.homeEB.setController(this);
    }

    show() {
        this.homeView.render();
        this.seoManager.setTitle('Accueil | MailProspector');
        this.homeEB.addEventListeners();
    }
}