import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
export default class EventsView {
    private apiManager;
    private storageManager;
    private eventsSelection;
    private eventsSelectionCountryFlag;
    private eventsSelectionCountryName;
    private eventsSelectionCity;
    private eventsContent;
    private eventsEmptyState;
    private eventsNotFoundEmptyState;
    private events;
    constructor(apiManager: APIManager, storageManager: StorageManager);
    activateView(): Promise<void>;
    private findElements;
    private setSelection;
    private loadContent;
    private renderCard;
    private formatDateTime;
    private saveEvent;
}
//# sourceMappingURL=eventsView.d.ts.map