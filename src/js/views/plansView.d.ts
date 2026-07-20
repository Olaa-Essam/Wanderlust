import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
export default class PlansView {
    private apiManager;
    private storageManager;
    private plansContent;
    private plansEmptyState;
    private filterButtons;
    private currentFilter;
    constructor(apiManager: APIManager, storageManager: StorageManager);
    activateView(): void;
    private findElements;
    private setupFilterListeners;
    private renderPlans;
    private createPlanCard;
}
//# sourceMappingURL=plansView.d.ts.map