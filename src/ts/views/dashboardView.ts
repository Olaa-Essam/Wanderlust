import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
import Loading from "../utils/loading.js";
import Toast from "../utils/toast.js";
import type { ICountry, ICountryState, ICountryDetails, IPublicHoliday } from "../interfaces/interfaces";
import CustomSelect, { SelectItem } from "../utils/customSelect.js";

export default class DashboardView {
  private apiManager: APIManager;
  private storageManager: StorageManager;

  // stats
  private aviableCountriesStateElement!: HTMLElement;
  private holidaysStateElement!: HTMLElement;
  private savedPlansStateElement!: HTMLElement;

  // data
  private aviableCountries: ICountry[] = [];
  private publicHolidays: IPublicHoliday[] = [];
  private selectedCountry: {name: string, code: string} = {name: "", code: ""};
  private selectedState: ICountryState = {name: "", lat: "", lng: "", stateCode: ""};
  private selectedYear: string = "";
  private countryDetails: ICountryDetails | null = null;

  // form
  private countryDropdown!: CustomSelect;
  private cityDropdown!: CustomSelect;
  private yearDropdown!: CustomSelect;
  private exploreButton! : HTMLButtonElement;

  // destination
  private selectedDestination!: HTMLElement;
  private selectedDestinationFlag!: HTMLImageElement;
  private selectedDestinationCountryName!: HTMLElement;
  private selectedDestinationCityName!: HTMLElement;
  private clearSelectionBtn! : HTMLButtonElement;

  // country information
  private countryInfoElement!: HTMLElement;
  private countryFlag!: HTMLImageElement;
  private countryName!: HTMLElement;
  private countryofficialName!: HTMLElement;
  private countryRegion!: HTMLElement;
  private countrySubregion!: HTMLElement;
  private countryLocalTime!: HTMLElement;
  private countryTimezone!: HTMLElement;
  private countryCapital!: HTMLElement;
  private countryPopulation!: HTMLElement;
  private countryArea!: HTMLElement;
  private countryContinent!: HTMLElement;
  private countryCallingCode!: HTMLElement;
  private countryDrivingSide!: HTMLElement;
  private countryWeekStart!: HTMLElement;
  private countryCurrencies!: HTMLElement;
  private countryLanguages!: HTMLElement;
  private countryBorders!: HTMLElement;
  private countryLinkBtn!: HTMLLinkElement;

  // country information placeholder
  private countryInfoPlaceholder!: HTMLElement;
  private placeholderIcon!: HTMLElement;
  private placeholderNormalIcon!: HTMLElement;
  private placeholderErrIcon!: HTMLElement;
  private placeholderNormalpragraph!: HTMLElement;
  private placeholderErrpragraph!: HTMLElement;

  // clock invertal id
  private localClockIntervalId: number | null = null;

  
  constructor (apiManager : APIManager, storageManager: StorageManager) {
    this.apiManager = apiManager;
    this.storageManager = storageManager;
  }

  public async init(): Promise<void> {
    this.findElements();
    this.initEventListeners();
    await this.getCountries();
    this.initCustomDropdowns();
    this.fillCountriesDropDown();
    this.fillYearDropDown();
  }

  public activateView(): void {
    this.setStats();
  
    if (this.selectedCountry.code) {
      if (this.countryDetails) {
        this.setupClock(this.countryDetails.timezone);
      }
    }
  }

  private initEventListeners(): void {
    this.clearSelectionBtn.addEventListener("click", () => this.clearSelection());
    this.exploreButton.addEventListener("click", () => this.exploreCountry());
  }

  // get elements from Dom
  private findElements(): void {
    // stats elements
    this.aviableCountriesStateElement = document.getElementById("stat-countries")!;
    this.holidaysStateElement = document.getElementById("stat-holidays")!;
    this.savedPlansStateElement = document.getElementById("stat-saved")!;

    // destination elements
    this.selectedDestination = document.getElementById("selected-destination")!;
    this.selectedDestinationFlag = document.getElementById("selected-country-flag")! as HTMLImageElement;
    this.selectedDestinationCountryName = document.getElementById("selected-country-name")!;
    this.selectedDestinationCityName = document.getElementById("selected-city-name")!;
    this.clearSelectionBtn = document.getElementById("clear-selection-btn") as HTMLButtonElement;

    // form elements
    this.exploreButton = document.getElementById("global-search-btn")! as HTMLButtonElement;

    // country information placeholders elements
    this.countryInfoPlaceholder = document.getElementById("country-info-placeholder")!;
    this.placeholderIcon = document.getElementById("placeholder-icon")!;
    this.placeholderNormalIcon = document.getElementById("placeholder-normal-icon")!;
    this.placeholderErrIcon = document.getElementById("place-error-icon")!;
    this.placeholderNormalpragraph = document.getElementById("placeholder-normal-pragraph")!;
    this.placeholderErrpragraph = document.getElementById("placeholder-error-pragraph")!;

    // country information elements
    this.countryInfoElement = document.getElementById("dashboard-country-info")!;
    this.countryFlag = document.getElementById("country-flag")! as HTMLImageElement; //w-160
    this.countryName = document.getElementById("country-name")!;
    this.countryofficialName = document.getElementById("country-official-name")!;
    this.countryRegion = document.getElementById("country-region")!;
    this.countrySubregion = document.getElementById("country-subregion")!;
    this.countryLocalTime = document.getElementById("country-local-time")!;
    this.countryTimezone = document.getElementById("country-timezone")!;
    this.countryCapital = document.getElementById("country-capital")!;
    this.countryPopulation = document.getElementById("country-population")!;
    this.countryArea = document.getElementById("country-area")!;
    this.countryContinent = document.getElementById("country-continent")!;
    this.countryCallingCode = document.getElementById("country-calling-code")!;
    this.countryDrivingSide = document.getElementById("contry-driving-side")!;
    this.countryWeekStart = document.getElementById("country-week-start")!;
    this.countryCurrencies = document.getElementById("country-currencies")!;
    this.countryLanguages = document.getElementById("country-languages")!;
    this.countryBorders = document.getElementById("country-borders")!;
    this.countryLinkBtn = document.getElementById("country-link-btn")! as HTMLLinkElement;
  }

  // fill countries drop down
  private fillCountriesDropDown():void {
    const countryItems: SelectItem[] = this.aviableCountries.map(c => ({
      id: c.countryCode,
      name: c.name,
      image: `https://flagcdn.com/${c.countryCode.toLowerCase()}.svg`
    }));
    this.countryDropdown.updateData(countryItems, "Select Country");
  }

  // select method for countries
  private async onSelectCountry(country: SelectItem):Promise<void> {
    this.selectedCountry.code = country.id;
    this.selectedCountry.name = country.name
    await this.fillStatesDropDown();

    this.selectedDestination.classList.remove("hidden");
    
    this.selectedDestinationFlag.src = `https://flagcdn.com/w80/${country.id.toLocaleLowerCase()}.png`;
    this.selectedDestinationFlag.alt = country.name;
    this.selectedDestinationFlag.classList.remove("hidden");

    this.selectedDestinationCountryName.innerText = country.name;
    this.selectedDestinationCountryName.classList.remove("hidden");

    this.selectedDestinationCityName.classList.add("hidden");
    this.selectedDestinationCityName.innerText = "";
  } 

  // fill states drop down
  private async fillStatesDropDown():Promise<void> {

    try {
      Loading.show("loading states");
      const states = await this.apiManager.fetchLocalCountriesAndStates(this.selectedCountry.code);
      const cityItems: SelectItem[] = states.map(s => ({
        id: s.stateCode,
        name: s.name,
        lat: s.lat,
        lng: s.lng
      }));
      this.cityDropdown.updateData(cityItems, states.length ? "Select City" : "Main/Capital");
    } catch (error) {
      console.error("fialed to load states", error);
      Toast.show("Failed to load states.", "error");
    } finally {
      Loading.hide();
    }
  }

  // select method for states
  private onSelectState(state: SelectItem):void {
    this.selectedState = {
      name: state.name,
      stateCode: state.id,
      lng: state.lng!,
      lat: state.lat!,
    };

    this.selectedDestinationCityName.innerText = state.name;
    this.selectedDestinationCityName.classList.remove("hidden");
  }

  // fill years drop down
  private fillYearDropDown(): void {
    const currentYear = new Date().getFullYear();
    const yearData: SelectItem[] = [];
    for (let i = 0; i < 3; i++) {
      const yearStr = (currentYear + i).toString();
      yearData.push({
        id: yearStr,
        name: yearStr
      });
    }
    this.yearDropdown.updateData(yearData, "Select Year");
  }

  // select method for years
  private onSelectYear(year: SelectItem):void {
    this.selectedYear = year.name;
  }

  // clear slection
  private clearSelection(): void {
    this.selectedDestination.classList.add("hidden");
  
    this.selectedDestinationFlag.classList.add("hidden");
    this.selectedDestinationFlag.alt = "";
    this.selectedDestinationFlag.src = "";
  
    this.selectedDestinationCityName.classList.add("hidden");
    this.selectedDestinationCityName.innerText = "";
    this.selectedState = {name: "", lat: "", lng: "", stateCode: ""};
    this.cityDropdown.reset("Select City");
  
    this.selectedDestinationCountryName.classList.add("hidden");
    this.selectedDestinationCountryName.innerText = "";
    this.selectedCountry.code = "";
    this.selectedCountry.name = "";
    this.countryDropdown.reset("Select Country");

    this.storageManager.setActiveCountryCode("");
    this.storageManager.setActiveCountryName("");
    this.storageManager.setActiveState({name: "", lat: "", lng: "", stateCode: ""});

    this.placeholderIcon.classList.remove("error");
    this.placeholderNormalIcon.classList.remove("hidden");
    this.placeholderErrIcon.classList.add("hidden");
    this.placeholderNormalpragraph.classList.remove("hidden");
    this.placeholderErrpragraph.classList.add("hidden");
  
    if (this.localClockIntervalId) {
      clearInterval(this.localClockIntervalId);
      this.localClockIntervalId = null;
    }
  
    this.fillCountriesDropDown();
    Toast.show("Destination cleared", "info");
  }

  // iniate drop downs 
  private initCustomDropdowns(): void {
    this.countryDropdown = new CustomSelect("custom-country-select", this.onSelectCountry.bind(this));
    this.cityDropdown = new CustomSelect("custom-city-select", this.onSelectState.bind(this));
    this.yearDropdown = new CustomSelect("custom-year-select", this.onSelectYear.bind(this));
  }

  // set data to stats
  private setStats(): void {
    this.aviableCountriesStateElement.innerText = this.aviableCountries.length.toString();
    this.holidaysStateElement.innerText = this.publicHolidays.length.toString();
    this.savedPlansStateElement.innerText = this.storageManager.getAllSavedPlans() ? this.storageManager.getAllSavedPlans().length.toString() : "0";
  }

  // get countries
  private async getCountries(): Promise<void> {
    try {
      this.aviableCountries = await this.apiManager.fetchAvailableCountries();
    } catch (err) {
      console.error("failed to get countries", err);
    }
  }

  // get public holidays
  private async getPublicHolidays(year: string, countryCode: string): Promise<void> {
    try {
      this.publicHolidays = await this.apiManager.fetchPublicHolidays(year, countryCode);
    } catch (err) {
      console.error("failed to get holidays", err);
    }
  }

  // get country details 
  private async getCountryDetails(countryCode: string): Promise<void> {
    try {
      Loading.show("Loading Country Detials");
      this.countryDetails = await this.apiManager.fetchCountryDetails(countryCode);

      if (!this.countryDetails) {
        throw new Error("Failed to load details from API");
      }

      Toast.show("country details loaded", "success");

      this.countryInfoPlaceholder.classList.add("hidden");
      this.countryInfoElement.classList.remove("hidden");

      this.countryFlag.src = `https://flagcdn.com/w160/${this.selectedCountry.code.toLowerCase()}.png`;
      this.countryFlag.alt = this.countryDetails.name.common;
      this.countryName.innerText = this.countryDetails.name.common;
      this.countryofficialName.innerText = this.countryDetails.name.official;
      this.countryRegion.innerText = this.countryDetails.region;
      this.countrySubregion.innerText = ` • ${this.countryDetails.subregion}`;
      this.setupClock(this.countryDetails.timezone);
      this.countryTimezone.innerText = this.countryDetails.timezone;
      this.countryCapital.innerText = this.countryDetails.capital.name;
      this.countryPopulation.innerText = this.countryDetails.population.toString();
      this.countryArea.innerText = `${this.countryDetails.area} km²`;
      this.countryContinent.innerText = this.countryDetails.continents.join(", ");
      this.countryCallingCode.innerText = `+${this.countryDetails.callingCode}`;
      this.countryDrivingSide.innerText = this.countryDetails.carDrivingSide;
      this.countryWeekStart.innerText = this.countryDetails.startOfWeek;

      let currenciesHTML = ""
      this.countryDetails.currencies.map((c) => (
        currenciesHTML += `<span class="extra-tag">${c.name} (${c.code} ${c.symbol})</span>`
      ))
      this.countryCurrencies.innerHTML = currenciesHTML;

      let languagesHTML = ""
      this.countryDetails.languages.map((l) => (
        languagesHTML += `<span class="extra-tag">${l}</span>`
      ))
      this.countryLanguages.innerHTML = languagesHTML;

      let bordersHTML = ""
      if (this.countryDetails.borders && this.countryDetails.borders.length > 0) {
        this.countryDetails.borders.map((b) => (
          bordersHTML += `<span class="extra-tag">${b}</span>`
        ))
      } else {
        bordersHTML = `<span class="extra-tag">N/A Island</span>`
      }
      this.countryBorders.innerHTML = bordersHTML;

      this.countryLinkBtn.href = this.countryDetails.link;

    } catch (error) {
      console.error("failed to fetch country details", error);
      Toast.show("Failed To Load Country Details", "error");

      this.placeholderIcon.classList.add("error");
      this.placeholderNormalIcon.classList.add("hidden");
      this.placeholderErrIcon.classList.remove("hidden");
      this.placeholderNormalpragraph.classList.add("hidden");
      this.placeholderErrpragraph.classList.remove("hidden");
    } finally {
      Loading.hide();
    }
  }

  // get local time by timezone
  private getLocalTimeByTimezone(timezoneStr: string): string {
    if (!timezoneStr || !timezoneStr.startsWith("UTC")) {
      timezoneStr = "UTC+00:00"; 
    }

    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  
    const sign = timezoneStr.includes("-") ? -1 : 1;
    
    const timeParts = timezoneStr.replace(/UTC[+-]/, "").split(":");
    const hoursOffset = parseInt(timeParts[0] || "0", 10);
    const minutesOffset = parseInt(timeParts[1] || "0", 10);
  
    const totalOffsetMs = ((hoursOffset * 60) + minutesOffset) * 60000 * sign;
    const localTargetDate = new Date(utcTime + totalOffsetMs);
  
    let hours = localTargetDate.getHours();
    const minutes = localTargetDate.getMinutes();
    const seconds = localTargetDate.getSeconds();
    
    const ampm = hours >= 12 ? "PM" : "AM";
    
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    const strHours = hours.toString().padStart(2, "0");
    const strMinutes = minutes.toString().padStart(2, "0");
    const strSeconds = seconds.toString().padStart(2, "0");
  
    return `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
  }

  // setup clock element
  private setupClock(timezone: string): void {
    if (this.localClockIntervalId) {
      clearInterval(this.localClockIntervalId);
    }
    this.countryLocalTime.innerText = this.getLocalTimeByTimezone(timezone);
    this.localClockIntervalId = window.setInterval(() => {
      this.countryLocalTime.innerText = this.getLocalTimeByTimezone(timezone);
    }, 1000);
  }

  // explore country
  private async exploreCountry(): Promise<void> {
    if (!this.selectedCountry.code) {
      Toast.show("Select a country", "info");
      return;
    }

    if (!this.selectedYear) {
      Toast.show("Select a year", "info");
      return;
    }

    this.storageManager.setActiveCountryCode(this.selectedCountry.code);
    this.storageManager.setActiveCountryName(this.selectedCountry.name);
    this.storageManager.setActiveState(this.selectedState);
    this.storageManager.setActiveYear(this.selectedYear);

    await this.getPublicHolidays(this.selectedYear, this.selectedCountry.code);
    this.holidaysStateElement.innerText = this.publicHolidays.length.toString();

    await this.getCountryDetails(this.selectedCountry.code);
  }
}