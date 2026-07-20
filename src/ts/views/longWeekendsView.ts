import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
import Loading from "../utils/loading.js";
import Toast from "../utils/toast.js";
import type { ILongWeekend } from "../interfaces/interfaces.js";

export default class LongWeekendsView {
  private apiManager: APIManager;
  private storageManager: StorageManager;

  // Header Elements
  private weekendsSelection!: HTMLElement;
  private weekendsSelectionCountryFlag!: HTMLImageElement;
  private weekendsSelectionCountryName!: HTMLElement;
  private weekendsSelectionYear!: HTMLElement;

  // Content Elements
  private weekendsContent!: HTMLElement;
  private weekendsEmptyState!: HTMLElement;

  constructor(apiManager: APIManager, storageManager: StorageManager) {
    this.apiManager = apiManager;
    this.storageManager = storageManager;
  }

  public async activateView(): Promise<void> {
    this.findElements();
    this.setSelection();

    const countryCode = this.storageManager.getActiveCountryCode();
    const year = this.storageManager.getActiveYear();

    if (countryCode === "" || year === "") {
      this.weekendsEmptyState.classList.remove("hidden");
      this.clearOldCards();
    } else {
      this.weekendsEmptyState.classList.add("hidden");
      await this.loadContent(countryCode, year);
    }
  }

  private findElements(): void {
    this.weekendsSelection = document.getElementById("lw-selection")!;
    this.weekendsSelectionCountryFlag = document.getElementById("lw-selection-country-flag") as HTMLImageElement;
    this.weekendsSelectionCountryName = document.getElementById("lw-selection-country-name")!;
    this.weekendsSelectionYear = document.getElementById("lw-selection-year")!;
    this.weekendsContent = document.getElementById("lw-content")!;
    this.weekendsEmptyState = document.getElementById("lw-empty-state")!;
  }

  private setSelection(): void {
    const code = this.storageManager.getActiveCountryCode();
    const name = this.storageManager.getActiveCountryName();
    const year = this.storageManager.getActiveYear();

    if (code && name && year) {
      this.weekendsSelection.classList.remove("hidden");
      this.weekendsSelectionCountryFlag.src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
      this.weekendsSelectionCountryName.innerText = name;
      this.weekendsSelectionYear.innerText = year;
    } else {
      this.weekendsSelection.classList.add("hidden");
    }
  }

  private clearOldCards(): void {
    const oldCards = this.weekendsContent.querySelectorAll(".weekend-card, .longweekend-card");
    oldCards.forEach(card => card.remove());
  }

  private async loadContent(countryCode: string, year: string): Promise<void> {
    try {
      Loading.show("Fetching Long Weekends...");
      this.clearOldCards();

      const weekends = await this.apiManager.fetchLongWeekends(year, countryCode);

      if (!weekends || weekends.length === 0) {
        this.weekendsEmptyState.classList.remove("hidden");
        return;
      }

      weekends.forEach((wk, index) => {
        this.createWeekendCard(wk, index);
      });

    } catch (error) {
      console.error("Error loading long weekends:", error);
      Toast.show("Failed to load long weekends", "error");
    } finally {
      Loading.hide();
    }
  }

  private createWeekendCard(weekend: ILongWeekend, index: number): void {
    const card = document.createElement("div");
    card.className = "lw-card";

    const cardHeader = document.createElement("div");
    cardHeader.className = "lw-card-header";
    
    const countBadge = document.createElement("span");
    countBadge.className = "lw-badge";
    countBadge.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${weekend.dayCount} Days`;

    const saveBtn = document.createElement("button");
    saveBtn.className = "holiday-action-btn";
    saveBtn.innerHTML = '<i class="fa-regular fa-heart">';
    
    saveBtn.addEventListener("click", () => {
      const isAdded = this.storageManager.addPlan({
        id: `lw-${weekend.startDate}-${index}`,
        type: "long weekend",
        title: `Long Weekend (${weekend.dayCount} Days)`,
        startDate: weekend.startDate,
        endDate: weekend.endDate,
        note: "Perfect opportunity for a mini-trip!"
      });
      saveBtn.classList.add("saved");
      saveBtn.innerHTML = '<i class="fa-solid fa-heart">';

      if (isAdded) {
        Toast.show("Saved to your plans!", "success");
      } else {
        saveBtn.classList.remove("saved");
        Toast.show("Already saved!", "info");
      }
    });

    cardHeader.append(countBadge, saveBtn);

    const cardTitle = document.createElement("h3");
    cardTitle.innerText = `Long Weekend #${index+1}`;

    const cardDates = document.createElement("div");
    cardDates.innerHTML = `<div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${this.formatWeekendDates(weekend.startDate, weekend.endDate)}</div>`

    const cardInfo = document.createElement("div");
    cardInfo.innerHTML = `<div class="lw-info-box ${!weekend.needBridgeDay ? "success" : "warning"}"><i class="fa-solid ${!weekend.needBridgeDay ? "fa-check-circle" : "fa-circle-info"}"></i> ${ !weekend.needBridgeDay ? "No extra days off needed!" : "Requires taking a bridge day off"}</div>`
    

    card.append(cardHeader, cardTitle, cardDates, cardInfo);
    this.weekendsContent.appendChild(card);
  }

  private formatWeekendDates(startDateStr: string, endDateStr: string): string {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid Dates";
    }
  
    const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    });
  
    const yearFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    });
  
    const startFormatted = monthDayFormatter.format(start);
    const endFormatted = monthDayFormatter.format(end);
    const yearFormattedStr = yearFormatter.format(end);
  
    return `${startFormatted} - ${endFormatted}, ${yearFormattedStr}`;
  }
}