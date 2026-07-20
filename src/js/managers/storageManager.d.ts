import type { TSavedItem, ICountryState } from "../interfaces/interfaces";
export default class StorageManager {
    private activeCountry;
    private activeYear;
    private activeState;
    private timezone;
    private savedPlans;
    private readonly STORAGE_KEY;
    constructor();
    private persist;
    getActiveCountryCode(): string;
    getActiveCountryName(): string;
    getActiveYear(): string;
    getActiveState(): ICountryState;
    getTimezone(): string;
    getAllSavedPlans(): TSavedItem[];
    getEventsSavedPlans(): TSavedItem[];
    getHolidaysSavedPlans(): TSavedItem[];
    getLongWeekendsSavedPlans(): TSavedItem[];
    setActiveCountryCode(countryCode: string): boolean;
    setActiveCountryName(countryName: string): boolean;
    setActiveYear(activeYear: string): boolean;
    setActiveState(state: ICountryState): boolean;
    setTimezone(timezone: string): boolean;
    addPlan(plan: TSavedItem): boolean;
    removePlan(id: string): boolean;
    clearAllPlans(): boolean;
}
//# sourceMappingURL=storageManager.d.ts.map