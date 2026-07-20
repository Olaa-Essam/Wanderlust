import Toast from "../utils/toast.js";
import Modal from "../utils/modal.js";
export default class PlansView {
    apiManager;
    storageManager;
    // DOM Elements
    plansContent;
    plansEmptyState;
    filterButtons;
    currentFilter = "all";
    constructor(apiManager, storageManager) {
        this.apiManager = apiManager;
        this.storageManager = storageManager;
    }
    activateView() {
        this.findElements();
        this.setupFilterListeners();
        this.renderPlans();
    }
    findElements() {
        this.plansContent = document.getElementById("plans-content");
        this.plansEmptyState = document.getElementById("plans-empty-state");
        this.filterButtons = document.querySelectorAll(".plans-filter-bar .plan-filter");
    }
    setupFilterListeners() {
        this.filterButtons.forEach(btn => {
            btn.onclick = (e) => {
                this.filterButtons.forEach(b => b.classList.remove("active"));
                const target = e.currentTarget;
                target.classList.add("active");
                this.currentFilter = target.getAttribute("data-filter") || "all";
                this.renderPlans();
            };
        });
    }
    renderPlans() {
        let plans = [];
        // جلب الداتا المفلترة من الـ Storage
        if (this.currentFilter === "all") {
            plans = this.storageManager.getAllSavedPlans();
        }
        else if (this.currentFilter === "holiday") {
            plans = this.storageManager.getHolidaysSavedPlans();
        }
        else if (this.currentFilter === "longweekend") {
            plans = this.storageManager.getLongWeekendsSavedPlans();
        }
        else if (this.currentFilter === "event") {
            plans = this.storageManager.getEventsSavedPlans();
        }
        if (plans.length === 0) {
            this.plansEmptyState.classList.remove("hidden");
            return;
        }
        else {
            const planCards = document.querySelectorAll(".plan-card");
            planCards.forEach(plan => plan.remove());
        }
        this.plansEmptyState.classList.add("hidden");
        plans.forEach(plan => this.createPlanCard(plan));
    }
    createPlanCard(plan) {
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
        <i class="fa-solid fa-calendar-day"></i> <strong>Date:</strong> ${plan.date}<br>
        <i class="fa-solid fa-info-circle"></i> ${plan.description || 'Public Holiday'}
      `;
        }
        else if (plan.type === "long weekend") {
            details.innerHTML = `
        <i class="fa-solid fa-plane-departure"></i> <strong>From:</strong> ${plan.startDate}<br>
        <i class="fa-solid fa-plane-arrival"></i> <strong>To:</strong> ${plan.endDate}
      `;
        }
        else if (plan.type === "event") {
            details.innerHTML = `
        <i class="fa-solid fa-clock"></i> <strong>When:</strong> ${plan.date?.localDate || ''}<br>
        <i class="fa-solid fa-location-dot"></i> <strong>Venue:</strong> ${plan.location?.name || 'Local Venue'}
      `;
        }
        // زرار الحذف مع ربطه بـ Modal التأكيد
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete-plan";
        deleteBtn.style.marginTop = "12px";
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Remove Plan';
        deleteBtn.onclick = () => {
            Modal.open("Remove Plan?", `Are you sure you want to remove "${plan.title}" from your saved itinerary?`, "Yes, Remove", "Cancel", () => {
                this.storageManager.removePlan(plan.id);
                Toast.show("Plan removed successfully", "success");
                this.renderPlans(); // إعادة رسم العناصر
            });
        };
        contentDiv.append(title, details, deleteBtn);
        card.append(typeBadge, contentDiv);
        this.plansContent.appendChild(card);
    }
}
//# sourceMappingURL=plansView.js.map