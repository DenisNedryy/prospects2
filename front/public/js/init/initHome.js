import { HomeCtrl } from "../class/controllers/HomeCtrl.js";
import { HomeEB } from "../class/eventBinders/HomeEB.js";
import { HomeView } from "../class/views/HomeView.js";
import { Entreprises } from  "../class/services/Entreprises.js";

export function initHome(seoManager) {

    const homeEB = new HomeEB();
    const homeView = new HomeView();
    const entreprise = new Entreprises();

    const views = Object.freeze({
        homeView: homeView
    });

    const eventBinders = Object.freeze({
        homeEB: homeEB
    });

    const services = Object.freeze({
        entreprise: entreprise
    })

    const homeCtrl = new HomeCtrl(seoManager, { views, eventBinders, services });

    return homeCtrl;

}