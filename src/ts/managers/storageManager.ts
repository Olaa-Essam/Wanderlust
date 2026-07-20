import type { TSavedItem, ICountryState } from "../interfaces/interfaces";

export default class StorageManager {
  private activeCountry: {name: string, code: string};
  private activeYear: string;
  private activeState: ICountryState;
  private timezone: string;
  private savedPlans: TSavedItem[];
  private readonly STORAGE_KEY = "wanderlust_storage";

  constructor() {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem(this.STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        this.activeCountry = parsed.activeCountry || {name: "", code: ""};
        this.activeYear = parsed.activeYear || "";
        this.activeState = parsed.activeState || { name: "", lat: "", lng: "", stateCode: "" };
        this.timezone = parsed.timezone || "";
        this.savedPlans = parsed.savedPlans || [];
        return;
      }
    }

    this.activeCountry =  {name: "", code: ""};
    this.activeYear = "";
    this.activeState = { name: "", lat: "", lng: "", stateCode: "" };
    this.timezone = "";
    this.savedPlans = [];
  }

  private persist(): void {
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
  getActiveCountryCode(): string {
    return this.activeCountry.code; 
  }

  getActiveCountryName(): string {
    return this.activeCountry.name; 
  }

  getActiveYear(): string {
    return this.activeYear; 
  }

  getActiveState(): ICountryState {
    return this.activeState;
  }

  getTimezone(): string {
    return this.timezone;
  }

  getAllSavedPlans(): TSavedItem[] {
    return this.savedPlans;
  }

  getEventsSavedPlans(): TSavedItem[] {
    return this.savedPlans.filter(p => p.type === "event");
  }

  getHolidaysSavedPlans(): TSavedItem[] {
    return this.savedPlans.filter(p => p.type === "holiday");
  }

  getLongWeekendsSavedPlans(): TSavedItem[] {
    return this.savedPlans.filter(p => p.type === "long weekend");
  }

  // ==========================================
  // Setters & Actions
  // ==========================================
  setActiveCountryCode(countryCode: string): boolean {
    this.activeCountry.code = countryCode;
    this.persist();
    return true;
  }

  setActiveCountryName(countryName: string): boolean {
    this.activeCountry.name = countryName;
    this.persist();
    return true;
  }

  setActiveYear(activeYear: string): boolean {
    this.activeYear = activeYear;
    this.persist();
    return true;
  }

  setActiveState(state: ICountryState): boolean {
    this.activeState = state;
    this.persist();
    return true;
  }

  setTimezone(timezone: string): boolean {
    this.timezone = timezone;
    this.persist();
    return true;
  }

  addPlan(plan: TSavedItem): boolean {
    if (!this.savedPlans.some(p => p.id === plan.id)) {
      this.savedPlans.push(plan);
      this.persist();
      return true;
    }
    return false;
  }

  removePlan(id: string): boolean {
    this.savedPlans = this.savedPlans.filter(p => p.id !== id);
    this.persist();
    return true;
  }

  clearAllPlans(): boolean {
    this.savedPlans = [];
    this.persist();
    return true;
  }

}