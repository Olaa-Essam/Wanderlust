export default function updatePlansCount(storageManager) {
    const plansCount = document.getElementById("plans-count");
    if (storageManager.getAllSavedPlans.length > 0) {
        plansCount.classList.remove("hidden");
        plansCount.innerText = storageManager.getAllSavedPlans().length.toString();
    }
    else {
        plansCount?.classList.add("hidden");
    }
}
//# sourceMappingURL=updatePlansCount.js.map