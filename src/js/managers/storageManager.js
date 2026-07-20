export default class StorageManager {
    activeCountry;
    activeYear;
    activeState;
    timezone;
    savedPlans;
    STORAGE_KEY = "wanderlust_storage";
    constructor() {
        if (typeof window !== "undefined") {
            const localData = localStorage.getItem(this.STORAGE_KEY);
            if (localData) {
                const parsed = JSON.parse(localData);
                this.activeCountry = parsed.activeCountry || { name: "", code: "" };
                this.activeYear = parsed.activeYear || "";
                this.activeState = parsed.activeState || { name: "", lat: "", lng: "", stateCode: "" };
                this.timezone = parsed.timezone || "";
                this.savedPlans = parsed.savedPlans || [];
                return;
            }
        }
        this.activeCountry = { name: "", code: "" };
        this.activeYear = "";
        this.activeState = { name: "", lat: "", lng: "", stateCode: "" };
        this.timezone = "";
        this.savedPlans = [];
    }
    persist() {
        if (typeof window !== "undefined") {
            const dataToSave = {
                activeCountry: this.activeCountry,
                activeYear: this.activeYear,
                activeState: this.activeState,
                timezone: this.timezone,
                savedPlans: this.savedPlans,
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
        }
    }
    // ==========================================
    // Getters
    // ==========================================
    getActiveCountryCode() {
        return this.activeCountry.code;
    }
    getActiveCountryName() {
        return this.activeCountry.name;
    }
    getActiveYear() {
        return this.activeYear;
    }
    getActiveState() {
        return this.activeState;
    }
    getTimezone() {
        return this.timezone;
    }
    getAllSavedPlans() {
        return this.savedPlans;
    }
    getEventsSavedPlans() {
        return this.savedPlans.filter(p => p.type === "event");
    }
    getHolidaysSavedPlans() {
        return this.savedPlans.filter(p => p.type === "holiday");
    }
    getLongWeekendsSavedPlans() {
        return this.savedPlans.filter(p => p.type === "long weekend");
    }
    // ==========================================
    // Setters & Actions
    // ==========================================
    setActiveCountryCode(countryCode) {
        this.activeCountry.code = countryCode;
        this.persist();
        return true;
    }
    setActiveCountryName(countryName) {
        this.activeCountry.name = countryName;
        this.persist();
        return true;
    }
    setActiveYear(activeYear) {
        this.activeYear = activeYear;
        this.persist();
        return true;
    }
    setActiveState(state) {
        this.activeState = state;
        this.persist();
        return true;
    }
    setTimezone(timezone) {
        this.timezone = timezone;
        this.persist();
        return true;
    }
    addPlan(plan) {
        if (!this.savedPlans.some(p => p.id === plan.id)) {
            this.savedPlans.push(plan);
            this.persist();
            return true;
        }
        return false;
    }
    removePlan(id) {
        this.savedPlans = this.savedPlans.filter(p => p.id !== id);
        this.persist();
        return true;
    }
    clearAllPlans() {
        this.savedPlans = [];
        this.persist();
        return true;
    }
}
//# sourceMappingURL=storageManager.js.map