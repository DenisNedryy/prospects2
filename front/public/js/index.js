// core
import { NavHighLighter } from "./class/core/NavHighLighter.js";
import { NavigationManager } from "./class/core/NavigationManager.js";
import { NavigationEventBinder } from "./class/core/NavigationEventBinder.js";
import { SEOManager } from "./class/core/SEOManager.js";
import { initHome } from "./init/initHome.js";
import { initAuth } from "./init/initAuth.js";
import { initData } from "./init/initData.js";


const seoManager = new SEOManager();


const routes = {
    "home": initHome(seoManager),
    "auth": initAuth(seoManager),
    "data": initData(seoManager)
};

const navHighLighter = new NavHighLighter();
const navigationManager = new NavigationManager(routes, navHighLighter);
navigationManager.init();

const navigationEventBinder = new NavigationEventBinder(navigationManager);
navigationEventBinder.bindClickLinks();


