// import { getIfisConnected } from "../../services/Auth.js";
// import { AuthServices } from "../services/AuthServices.js";
// import { UserServices } from "../services/UserServices.js";

export class NavigationManager {

    constructor(routes, navHighLighter) {
        this.routes = routes;
        this.navHighLighter = navHighLighter;

        window.addEventListener('popstate', (event) => {
            const page = event.state?.page || this.getPageFromURL();
            this.navigate(page, null);
        });
    }

    getPageFromURL() {
        const pathname = window.location.pathname;
        const segments = pathname.split("/").filter(Boolean);

        if (segments.length === 1) {
            return segments[0];
        } else if (segments.length === 2) {
            return segments.join("_");
        }
        return null;
    }

    show404() {
        const el = document.getElementById("root");
        if (el) {
            el.innerHTML = `<h2>404</h2><p>Page introuvable</p>`
        }
    }

    async navigate(pageKey, push = true) {
        const pageKeyWithoutParams = pageKey.split("?")[0];
        const controller = this.routes[pageKeyWithoutParams];
        // const userServices = new UserServices();
        // const authRes = await userServices.getMyProfil();
        // const amIConnected = authRes.ok;

        // if (!amIConnected && pageKey !== 'auth') {
        //     this.navigate('auth', true);
        //     return;
        // }

        if (!controller) {
            this.show404();
            return;
        }

        if (push) {
            const url = `/${pageKey.replace('_', '/')}`;
            history.pushState({ page: pageKey }, '', url); // ajouter une nouvelle entrée dans l’historique du navigateur
        }

        controller.show();
        this.navHighLighter.highlight(pageKey);
    }


    init() {
        const initialPage = this.getPageFromURL() || 'home';
        this.navigate(initialPage, false);
    }
}