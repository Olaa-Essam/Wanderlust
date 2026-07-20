import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
import Loading from "../utils/loading.js";
import Toast from "../utils/toast.js";
import Modal from "../utils/modal.js";
import type { TSavedItem } from "../interfaces/interfaces.js";

export default class PlansView {
  private apiManager: APIManager;
  private storageManager: StorageManager;

  // DOM Elements
  private plansContent!: HTMLElement;
  private plansEmptyState!: HTMLElement;
  private filterButtons!: NodeListOf<HTMLButtonElement>;
  
  private currentFilter: string = "all";

  constructor(apiManager: APIManager, storageManager: StorageManager) {
    this.apiManager = apiManager;
    this.storageManager = storageManager;
  }

  public activateView(): void {
    this.findElements();
    this.setupFilterListeners();
    this.renderPlans();
  }

  private findElements(): void {
    this.plansContent = document.getElementById("plans-content")!;
    this.plansEmptyState = document.getElementById("plans-empty-state")!;
    this.filterButtons = document.querySelectorAll(".plans-filter-bar .plan-filter");
  }

  private setupFilterListeners(): void {
    this.filterButtons.forEach(btn => {
      btn.onclick = (e) => {
        this.filterButtons.forEach(b => b.classList.remove("active"));
        const target = e.currentTarget as HTMLButtonElement;
        target.classList.add("active");
        
        this.currentFilter = target.getAttribute("data-filter") || "all";
        this.renderPlans();
      };
    });
  }

  private renderPlans(): void {



    let plans: TSavedItem[] = [];

    // جلب الداتا المفلترة من الـ Storage
    if (this.currentFilter === "all") {
      plans = this.storageManager.getAllSavedPlans();
    } else if (this.currentFilter === "holiday") {
      plans = this.storageManager.getHolidaysSavedPlans();
    } else if (this.currentFilter === "longweekend") {
      plans = this.storageManager.getLongWeekendsSavedPlans();
    } else if (this.currentFilter === "event") {
      plans = this.storageManager.getEventsSavedPlans();
    }

    if (plans.length === 0) {
      this.plansEmptyState.classList.remove("hidden");
      return;
    } else {
      const planCards = document.querySelectorAll(".plan-card");
      planCards.forEach(plan => plan.remove());
    }

    this.plansEmptyState.classList.add("hidden");
    plans.forEach(plan => this.createPlanCard(plan));
  }

  private createPlanCard(plan: TSavedItem): void {
    const card = document.createElement("div");
    card.className = "plan-card";

    // البادج العلوي لنوع الخطة
    const typeBadge = document.createElement("span");
    const safeType = plan.type.replace(/\s+/g, ''); // تحويل "long weekend" لكلمة واحدة تليق مع الـ CSS class
    typeBadge.className = `plan-card-type ${safeType}`;
    typeBadge.innerText = plan.type;

    const contentDiv = document.createElement("div");
    contentDiv.className = "plan-card-content";

    const title = document.createElement("h4");
    title.innerText = plan.title;

    const details = document.createElement("p");
    details.className = "plan-card-details";

    // تخصيص الأيقونات والداتا حسب النوع
    if (plan.type === "holiday") {
      details.innerHTML = `
        <i class="fa-solid fa-calendar-day"></i> <strong>Date:</strong> ${(plan as any).date}<br>
        <i class="fa-solid fa-info-circle"></i> ${(plan as any).description || 'Public Holiday'}
      `;
    } else if (plan.type === "long weekend") {
      details.innerHTML = `
        <i class="fa-solid fa-plane-departure"></i> <strong>From:</strong> ${(plan as any).startDate}<br>
        <i class="fa-solid fa-plane-arrival"></i> <strong>To:</strong> ${(plan as any).endDate}
      `;
    } else if (plan.type === "event") {
      details.innerHTML = `
        <i class="fa-solid fa-clock"></i> <strong>When:</strong> ${(plan as any).date?.localDate || ''}<br>
        <i class="fa-solid fa-location-dot"></i> <strong>Venue:</strong> ${(plan as any).location?.name || 'Local Venue'}
      `;
    }

    // زرار الحذف مع ربطه بـ Modal التأكيد
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete-plan";
    deleteBtn.style.marginTop = "12px";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Remove Plan';
    
    deleteBtn.onclick = () => {
      Modal.open(
        "Remove Plan?",
        `Are you sure you want to remove "${plan.title}" from your saved itinerary?`,
        "Yes, Remove",
        "Cancel",
        () => {
          this.storageManager.removePlan(plan.id);
          Toast.show("Plan removed successfully", "success");
          this.renderPlans(); // إعادة رسم العناصر
        }
      );
    };

    contentDiv.append(title, details, deleteBtn);
    card.append(typeBadge, contentDiv);
    this.plansContent.appendChild(card);
  }
}