import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
export default class HolidaysView {
    private apiManager;
    private storageManager;
    private holidaysSelection;
    private holidaysSelectionCountryFlag;
    private holidaysSelectionCountryName;
    private holidaysSelectionYear;
    private holidaysContent;
    private holidaysEmptyState;
    private holidays;
    constructor(apiManager: APIManager, storageManager: StorageManager);
    activateView(): Promise<void>;
    private findElements;
    private setSelection;
    private loadContent;
    private renderCard;
    private getMonth;
    private getDayName;
    private saveHoliday;
}
//# sourceMappingURL=holidaysView.d.ts.map