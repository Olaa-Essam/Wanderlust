import HeaderManager from "./views/headerView.js";

export default class TabsRouter {
  private navItems: NodeListOf<HTMLElement>;
  private views: NodeListOf<HTMLElement>;
  private appViews: Record<string, any>;
  private gotoDashboardBtns: NodeListOf<HTMLButtonElement>;

  constructor(appViews: Record<string, any>) {
    this.navItems = document.querySelectorAll<HTMLElement>('.sidebar-nav .nav-item');
    this.views = document.querySelectorAll<HTMLElement>('#main-content section.view');
    this.gotoDashboardBtns = document.querySelectorAll('.goto-dashboard-btn') as NodeListOf<HTMLButtonElement>;

    this.appViews = appViews;
    
    this.init();
  }

  private init(): void {
    if (!this.navItems || !this.views) return;

    HeaderManager.init();
    this.handleInitialRoute();

    if (this.gotoDashboardBtns) {
        this.gotoDashboardBtns.forEach((btn) =>{
          btn.addEventListener('click', (e: Event) => {
            e.preventDefault();
            window.history.pushState({ view: 'dashboard' }, '', '/');
            this.navigateToView('dashboard');
          });
        });
    }

    window.addEventListener('popstate', () => {
      this.handleInitialRoute();
    });

    this.navItems.forEach((item: HTMLElement) => {
      item.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const viewName = item.getAttribute('data-view');
        if (!viewName) return;

        if (viewName === "dashboard") {
          window.history.pushState({ view: viewName }, '', `/`);
        } else {
          window.history.pushState({ view: viewName }, '', `/${viewName}`);
        }
        this.navigateToView(viewName);
      });
    });
  }

  private navigateToView(viewName: string): void {
    const targetViewId = `${viewName}-view`;
    const targetView = document.getElementById(targetViewId);

    if (targetView) {
      this.views.forEach((view: HTMLElement) => view.classList.remove('active'));
      targetView.classList.add('active');
    }

    this.navItems.forEach((nav: HTMLElement) => {
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

  private handleInitialRoute(): void {
    let currentPath = window.location.pathname.replace(/^\//, '') || 'dashboard';
    this.navigateToView(currentPath);
  }
}