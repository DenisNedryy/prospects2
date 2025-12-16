import { AuthCtrl } from "../class/controllers/AuthCtrl.js";
import { AuthEB } from "../class/eventBinders/AuthEB.js";
import { AuthView } from "../class/views/AuthView.js";

export function initAuth(seoManager) {

    const authEB = new AuthEB();
    const authView = new AuthView();

    const views = Object.freeze({
        authView: authView
    });

    const eventBinders = Object.freeze({
        authEB: authEB
    });

    const authCtrl = new AuthCtrl(seoManager, { views, eventBinders });

    return authCtrl;

}