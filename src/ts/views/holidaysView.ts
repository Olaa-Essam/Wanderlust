import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
import Loading from "../utils/loading.js";
import Toast from "../utils/toast.js";
import type { IPublicHoliday } from "../interfaces/interfaces.js";

export default class HolidaysView {
  private apiManager: APIManager;
  private storageManager: StorageManager;

  // header elements
  private holidaysSelection!: HTMLElement;
  private holidaysSelectionCountryFlag!: HTMLImageElement;
  private holidaysSelectionCountryName!: HTMLElement;
  private holidaysSelectionYear!: HTMLElement;

  // content elements
  private holidaysContent!: HTMLElement;
  private holidaysEmptyState!: HTMLElement;

  // data
  private holidays: IPublicHoliday[] = [];


  constructor(apiManager: APIManager, storageManager: StorageManager) {
    this.apiManager = apiManager;
    this.storageManager = storageManager;
  }

  public async activateView(): Promise<void> {
    this.findElements();
    this.setSelection();
    if (this.storageManager.getActiveYear() === "" || this.storageManager.getActiveCountryCode() === "") {
      this.holidaysEmptyState.classList.remove("hidden");
      const oldCards = this.holidaysContent.querySelectorAll(".holiday-card");
      oldCards.forEach(card => card.remove());
    } else {
      this.holidaysEmptyState.classList.add("hidden");
      await this.loadContent(this.storageManager.getActiveYear(), this.storageManager.getActiveCountryCode());
    }
  }

  private findElements(): void {
    // header elements
    this.holidaysSelection = document.getElementById("holidays-selection")!;
    this.holidaysSelectionCountryFlag = document.getElementById("holidays-selection-country-flag")! as HTMLImageElement;
    this.holidaysSelectionCountryName = document.getElementById("holidays-selection-country-name")!;
    this.holidaysSelectionYear = document.getElementById("holidays-selection-year")!;

    // content elements
    this.holidaysContent = document.getElementById("holidays-content")!;
    this.holidaysEmptyState = document.getElementById("holidays-empty-state")!;
  }

  private setSelection(): void{
    if (this.storageManager.getActiveCountryCode() === "" || this.storageManager.getActiveYear() === "") {
      this.holidaysSelection.classList.add("hidden");
      return;
    }

    this.holidaysSelection.classList.remove("hidden");
    this.holidaysSelectionCountryFlag.src = `https://flagcdn.com/w40/${this.storageManager.getActiveCountryCode().toLowerCase()}.png`
    this.holidaysSelectionCountryFlag.alt = this.storageManager.getActiveCountryName();
    this.holidaysSelectionCountryName.innerText = this.storageManager.getActiveCountryName();
    this.holidaysSelectionYear.innerText = this.storageManager.getActiveYear();
  }

  private async loadContent(year: string, countryCode: string): Promise<void> {
    try {
      Loading.show("Loading Holidays");
      this.holidays = await this.apiManager.fetchPublicHolidays(year, countryCode.toUpperCase());

      if(!this.holidays || this.holidays.length === 0) {
        throw new Error("Failed to load holidays");
      }
      const oldCards = this.holidaysContent.querySelectorAll(".holiday-card");
      oldCards.forEach(card => card.remove());
      this.holidays.map((holiday) => {
        this.renderCard(holiday);
      });
    } catch (error) {
      console.error(error);
      Toast.show("Failed to load holidays", "error");
    } finally {
      Loading.hide();
    }
  }

  private renderCard(holiday: IPublicHoliday): void {

    const dateFormated = holiday.date.split("-");

    // create card
    const card = document.createElement("div");
    card.className = "holiday-card";
    
    // create card header
    const cardHeader = document.createElement("div");
    cardHeader.className = "holiday-card-header";

    // create date box
    const dateBox = document.createElement("div");
    dateBox.className = "holiday-date-box"

    // create date box spans
    const day = document.createElement("span");
    day.className = "day"
    day.innerText = dateFormated[2]!;

    const month = document.createElement("span");
    month.className = "month"
    month.innerText = this.getMonth(dateFormated[1]!);
    
    // append spans to date box
    dateBox.append(day, month);

    // create save button
    const saveBtn = document.createElement("button");
    const isSaved = this.storageManager.getHolidaysSavedPlans().find((plan) => plan.id === holiday.id) ? true : false;
    saveBtn.className = `holiday-action-btn ${isSaved && "saved"}`;

    // create save icon
    const saveBtnIcon = document.createElement("i");
    saveBtnIcon.className =  isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart";

    saveBtn.addEventListener("click", () => {
      if (!isSaved) {
        saveBtn.removeChild(saveBtnIcon);
        saveBtnIcon.classList.remove("fa-regular");
        saveBtnIcon.classList.add("fa-solid");
        saveBtn.classList.add("saved");
        saveBtn.append(saveBtnIcon);
        this.saveHoliday(holiday);
        Toast.show("Succesfully saved to plans", "success");
      } else {
        Toast.show("Already saved!", "info");
      }
    });

    // append icon to button
    saveBtn.append(saveBtnIcon);

    // append date box and save btn to header
    cardHeader.append(dateBox, saveBtn);

    // create Title
    const cardTitle =  document.createElement("h3");
    cardTitle.innerText = holiday.localName;

    // create name
    const cardName = document.createElement("p");
    cardName.className = "holiday-name";
    cardName.innerText = holiday.name;

    // create card footer
    const cardFooter = document.createElement("div");
    cardFooter.className = "holiday-card-footer";

    // create footer spans
    const dayBadge = document.createElement("span");
    dayBadge.className = "holiday-day-badge";

    const dayBadgeIcon = document.createElement("i");
    dayBadgeIcon.className = "fa-regular fa-calendar"
    dayBadge.append(dayBadgeIcon);
    const dayNameText = document.createTextNode(` ${this.getDayName(holiday.date)}`);
    dayBadge.append(dayNameText);

    cardFooter.append(dayBadge);

    holiday.types.forEach((type) => {
      const typeBadge = document.createElement("span");
      typeBadge.className = "holiday-type-badge";
      typeBadge.innerText = type;
      cardFooter.append(typeBadge);
    })

    // append elements to card
    card.append(cardHeader, cardTitle, cardName, cardFooter);

    this.holidaysContent.appendChild(card)
  }

  private getMonth(month: string): string {
    switch (month) {
      case "01":
        return "JAN";
      case "02":
        return "FEB";
      case "03":
        return "MAR";
      case "04":
        return "APR";
      case "05":
        return "MAY";
      case "06":
        return "JUN";
      case "07":
        return "JUL";
      case "08":
        return "AUG";
      case "09":
        return "SEP";
      case "10":
        return "OCT";
      case "11":
        return "NOV";
      case "12":
        return "DEC";
      default:
        return "";
    }
  }

  private getDayName(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  private saveHoliday(holiday: IPublicHoliday): void {
    this.storageManager.addPlan({
      id: holiday.id,
      type: "holiday",
      title: holiday.localName,
      description: holiday.name,
      date: holiday.date
    })
  }

}