import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
import Loading from "../utils/loading.js";
import Toast from "../utils/toast.js";
import type { ITicketmasterEvent } from "../interfaces/interfaces.js";

export default class EventsView {
  private apiManager: APIManager;
  private storageManager: StorageManager;

  // header elements
  private eventsSelection!: HTMLElement;
  private eventsSelectionCountryFlag!: HTMLImageElement;
  private eventsSelectionCountryName!: HTMLElement;
  private eventsSelectionCity!: HTMLElement;

  // content elements
  private eventsContent!: HTMLElement;
  private eventsEmptyState!: HTMLElement;
  private eventsNotFoundEmptyState!: HTMLElement;

  // data
  private events: ITicketmasterEvent[] = [];

  constructor(apiManager: APIManager, storageManager: StorageManager) {
    this.apiManager = apiManager;
    this.storageManager = storageManager;
  }

  public async activateView(): Promise<void> {
    this.findElements();
    this.setSelection();
    if (this.storageManager.getActiveCountryCode() === "" || this.storageManager.getActiveState().stateCode === "") {
      const oldCards = this.eventsContent.querySelectorAll(".event-card");
      oldCards.forEach(card => card.remove());
      this.eventsNotFoundEmptyState.classList.add("hidden");
      this.eventsEmptyState.classList.remove("hidden");
    }  else {
      this.eventsNotFoundEmptyState.classList.add("hidden");
      this.eventsEmptyState.classList.add("hidden");
      await this.loadContent(this.storageManager.getActiveCountryCode(), this.storageManager.getActiveState().stateCode);
    }
  }

  private findElements():void {
    // header elements
    this.eventsSelection = document.getElementById("events-selection")!;
    this.eventsSelectionCountryFlag = document.getElementById("events-selection-country-flag")! as HTMLImageElement;
    this.eventsSelectionCountryName = document.getElementById("events-selection-country-name")!;
    this.eventsSelectionCity = document.getElementById("events-selection-city-name")!;

    // content elements
    this.eventsContent = document.getElementById("events-content")!;
    this.eventsEmptyState = document.getElementById("events-empty-state")!;
    this.eventsNotFoundEmptyState = document.getElementById("events-not-found-empty-state")!;
  }

  private setSelection(): void{
    if (this.storageManager.getActiveCountryCode() === "" || this.storageManager.getActiveState().stateCode === "") {
      this.eventsSelection.classList.add("hidden");
      return;
    }

    this.eventsSelection.classList.remove("hidden");
    this.eventsSelectionCountryFlag.src = `https://flagcdn.com/w40/${this.storageManager.getActiveCountryCode().toLowerCase()}.png`
    this.eventsSelectionCountryFlag.alt = this.storageManager.getActiveCountryName();
    this.eventsSelectionCountryName.innerText = this.storageManager.getActiveCountryName();
    this.eventsSelectionCity.innerText = this.storageManager.getActiveState().name;
  }

  private async loadContent(countryCode: string, stateCode: string): Promise<void> {
    try {
      Loading.show("Loading Events");
      this.events = await this.apiManager.fetchEvents(countryCode, stateCode);

      if(!this.events || this.events.length === 0) {
        this.eventsNotFoundEmptyState.classList.remove("hidden");
        return;
      }
      this.eventsNotFoundEmptyState.classList.add("hidden");
      const oldCards = this.eventsContent.querySelectorAll(".event-card");
      oldCards.forEach(card => card.remove());
      this.events.map((event) => {
        this.renderCard(event);
      });
    } catch (error) {
      console.error(error);
    } finally {
      Loading.hide();
    }
  }

  private renderCard(event: ITicketmasterEvent): void {

    // create card
    const card = document.createElement("div");
    card.className = "event-card";
    
    // create card image
    const cardImage = document.createElement("div");
    cardImage.className = "event-card-image";

    //create event image
    const eventImage = document.createElement("img");
    eventImage.src = event.image.url;
    eventImage.alt= event.name;

    // create event category
    const eventCategory = document.createElement("span");
    eventCategory.className = "event-card-category";
    eventCategory.innerText = event.type; 

    // create save button
    const saveBtn = document.createElement("button");
    saveBtn.className = `event-card-save ${this.storageManager.getEventsSavedPlans().find((plan) => plan.id === event.id) !== undefined && "saved"}`;

    // create save icon
    const saveBtnIcon = document.createElement("i");
    saveBtnIcon.className =  this.storageManager.getEventsSavedPlans().find((plan) => plan.id === event.id) !== undefined ? "fa-solid fa-heart" : "fa-regular fa-heart";

    saveBtn.addEventListener("click", () => {
      if (this.storageManager.getEventsSavedPlans().find((plan) => plan.id === event.id) === undefined) {
        saveBtnIcon.classList.remove("fa-regular");
        saveBtnIcon.classList.add("fa-solid");
        saveBtn.classList.add("saved");
        this.saveEvent(event);
        Toast.show("Succesfully saved to plans", "success");
      } else {
        Toast.show("Already saved!", "info");
      }
    });

    // append icon to button
    saveBtn.append(saveBtnIcon);

    // append date box and save btn to header
    cardImage.append(eventImage, eventCategory, saveBtn);

    // create card body
    const cardBody = document.createElement("div");
    cardBody.className = "event-card-body"

    // create Title
    const cardTitle =  document.createElement("h3");
    cardTitle.innerText = event.name;

    // create card info
    const cardInfo = document.createElement("div");
    cardInfo.className = "event-card-info";

    const cardDate = document.createElement("div");
    const dateIcon = document.createElement("i");
    dateIcon.className = "fa-regular fa-calendar";
    const dateText = document.createTextNode(` ${this.formatDateTime(event.dates.localDate, event.dates.localTime)}`);
    cardDate.append(dateIcon, dateText);

    const cardLocation = document.createElement("div");
    const locationIcon = document.createElement("i");
    locationIcon.className = "fa-solid fa-location-dot";
    const locationText = document.createTextNode(` ${event.venues.name}, ${event.venues.city}`);
    cardLocation.append(locationIcon, locationText);

    cardInfo.append(cardDate, cardLocation);

    // create card footer
    const cardFooter = document.createElement("div");
    cardFooter.className = "event-card-footer";

    // create footer btns
    const footerSaveBtn = document.createElement("button");
    footerSaveBtn.className = "btn-event";
    const footerSaveBtnIcon = document.createElement("i");
    footerSaveBtnIcon.className = "fa-regular fa-heart";
    const footerSaveBtnText = document.createTextNode(" Save");
    footerSaveBtn.append(footerSaveBtnIcon, footerSaveBtnText);

    footerSaveBtn.addEventListener("click", () => {
      if (this.storageManager.getEventsSavedPlans().find((plan) => plan.id === event.id) === undefined) {
        saveBtnIcon.classList.remove("fa-regular");
        saveBtnIcon.classList.add("fa-solid");
        saveBtn.classList.add("saved");
        this.saveEvent(event);
        Toast.show("Succesfully saved to plans", "success");
      } else {
        Toast.show("Already saved!", "info");
      }
    });

    const eventLink = document.createElement("a");
    eventLink.target = "_blank";
    eventLink.rel = "noopener noreferrer";
    eventLink.href = event.url;
    eventLink.className = "btn-buy-ticket";
    const eventLinkIcon = document.createElement("i");
    eventLinkIcon.className = "fa-solid fa-ticket";
    const eventLinlText = document.createTextNode(" Buy Tickets");
    eventLink.append(eventLinkIcon, eventLinlText);

    cardFooter.append(footerSaveBtn, eventLink);

    cardBody.append(cardTitle, cardInfo, cardFooter);
    
    // append elements to card
    card.append(cardImage, cardBody);

    this.eventsContent.appendChild(card);
  }

  private formatDateTime(localDate: string, localTime: string): string {
    const dateTimeString = `${localDate}T${localTime}`;
    const date = new Date(dateTimeString);

    if (isNaN(date.getTime())) {
      return "UnKown";
    }
  
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  
    return formatter.format(date).replace(/,\s([^,]+)$/, " at $1");
  }

  private saveEvent(event: ITicketmasterEvent): void {
    this.storageManager.addPlan({
      id: event.id,
      type: "event",
      title: event.name,
      location: event.venues,
      date: event.dates
    })
  }
}