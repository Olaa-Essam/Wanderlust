import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
export default class LongWeekendsView {
    private apiManager;
    private storageManager;
    private weekendsSelection;
    private weekendsSelectionCountryFlag;
    private weekendsSelectionCountryName;
    private weekendsSelectionYear;
    private weekendsContent;
    private weekendsEmptyState;
    constructor(apiManager: APIManager, storageManager: StorageManager);
    activateView(): Promise<void>;
    private findElements;
    private setSelection;
    private clearOldCards;
    private loadContent;
    private createWeekendCard;
    private formatWeekendDates;
}
//# sourceMappingURL=longWeekendsView.d.ts.map