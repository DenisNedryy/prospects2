export class NavigationEventBinder {
    constructor(navigationManager) {
        this.navigationManager = navigationManager;
    }

    bindClickLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-link]');
            if (link) {
                e.preventDefault();
                const pathname = link.getAttribute('href');
                const segments = pathname.split('/').filter(Boolean);
                const page = segments.join("_");
                this.navigationManager.navigate(page);
            }
        });
    }
}