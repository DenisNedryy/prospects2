export class AuthCtrl {

    constructor(seoManager, { views, eventBinders }) {
        this.seoManager = seoManager;
        this.authView = views.authView;
        this.authEB = eventBinders.authEB;

        this.authEB.setController(this);
    }

    show() {
        this.authView.render();
        this.seoManager.setTitle('Auth | MailProspector');
        this.authEB.addEventListeners();
    }
}