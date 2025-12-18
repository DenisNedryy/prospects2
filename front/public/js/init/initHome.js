import { HomeCtrl } from "../class/controllers/HomeCtrl.js";
import { HomeEB } from "../class/eventBinders/HomeEB.js";
import { HomeView } from "../class/views/HomeView.js";
import { EntreprisesService } from "../class/services/EntreprisesService.js";
import { EnrichmentsService } from "../class/services/EnrichmentsService.js";
import { QuotaService } from "../class/services/QuotaService.js"
import { Maps } from "../class/models/Maps.js";
import { Sounds } from "../class/utils/Sounds.js";

export function initHome(seoManager) {

    const homeEB = new HomeEB();
    const homeView = new HomeView();
    const entreprisesService = new EntreprisesService();
    const enrichmentsService = new EnrichmentsService();
    const quotaService = new QuotaService();
    const sounds = new Sounds();
    const maps = new Maps();

    const views = Object.freeze({
        homeView: homeView
    });

    const eventBinders = Object.freeze({
        homeEB: homeEB
    });

    const services = Object.freeze({
        entreprisesService: entreprisesService,
        enrichmentsService: enrichmentsService,
        quotaService: quotaService
    })

    const models = Object.freeze({
        maps: maps
    });

    const utils = Object.freeze({
        sounds: sounds
    });


    const homeCtrl = new HomeCtrl(seoManager, { views, eventBinders, services, models, utils });

    return homeCtrl;

}