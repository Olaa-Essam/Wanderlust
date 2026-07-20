import HeaderManager from "./views/headerView.js";
export default class TabsRouter {
    navItems;
    views;
    appViews;
    gotoDashboardBtns;
    constructor(appViews) {
        this.navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        this.views = document.querySelectorAll('#main-content section.view');
        this.gotoDashboardBtns = document.querySelectorAll('.goto-dashboard-btn');
        this.appViews = appViews;
        this.init();
    }
    init() {
        if (!this.navItems || !this.views)
            return;
        HeaderManager.init();
        this.handleInitialRoute();
        if (this.gotoDashboardBtns) {
            this.gotoDashboardBtns.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.history.pushState({ view: 'dashboard' }, '', '/');
                    this.navigateToView('dashboard');
                });
            });
        }
        window.addEventListener('popstate', () => {
            this.handleInitialRoute();
        });
        this.navItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = item.getAttribute('data-view');
                if (!viewName)
                    return;
                if (viewName === "dashboard") {
                    window.history.pushState({ view: viewName }, '', `/`);
                }
                else {
                    window.history.pushState({ view: viewName }, '', `/${viewName}`);
                }
                this.navigateToView(viewName);
            });
        });
    }
    navigateToView(viewName) {
        const targetViewId = `${viewName}-view`;
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            this.views.forEach((view) => view.classList.remove('active'));
            targetView.classList.add('active');
        }
        this.navItems.forEach((nav) => {
            nav.classList.remove('active');
            if (nav.getAttribute('data-view') === viewName) {
                nav.classList.add('active');
                const spanElement = nav.querySelector('span');
                const titleText = spanElement?.textContent || viewName;
                HeaderManager.updateHeader(viewName, titleText);
            }
        });
        const currentView = this.appViews[viewName];
        if (currentView) {
            if (typeof currentView.activateView === 'function') {
                currentView.activateView();
            }
            else if (typeof currentView.init === 'function') {
                currentView.init();
            }
        }
    }
    handleInitialRoute() {
        let currentPath = window.location.pathname.replace(/^\//, '') || 'dashboard';
        this.navigateToView(currentPath);
    }
}
//# sourceMappingURL=router.js.map