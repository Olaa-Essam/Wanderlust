import APIManager from "./managers/APIManager.js";
import StorageManager from "./managers/storageManager.js";
import TabsRouter from "./router.js";
import DashboardView from "./views/dashboardView.js";
import HolidaysView from "./views/holidaysView.js";
import LongWeekendsView from "./views/longWeekendsView.js";
import EventsView from "./views/eventsView.js";
import WeatherView from "./views/weatherView.js";
import CurrencyView from "./views/currencyView.js";
import PlansView from "./views/plansView.js";
window.addEventListener('beforeunload', () => {
    const keyName = 'wanderlust_storage';
    const data = localStorage.getItem(keyName);
    if (data) {
        try {
            const parsedData = JSON.parse(data);
            parsedData.activeCountry = { name: "", code: "" };
            parsedData.activeYear = "";
            parsedData.timezone = "";
            parsedData.activeState = { name: "", lat: "", lng: "", stateCode: "" };
            localStorage.setItem(keyName, JSON.stringify(parsedData));
        }
        catch (error) {
            console.error("Error parsing localStorage data on refresh:", error);
        }
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const apiManager = new APIManager();
    const storageManager = new StorageManager();
    const dashboardView = new DashboardView(apiManager, storageManager);
    await dashboardView.init();
    const holidaysView = new HolidaysView(apiManager, storageManager);
    const longWeekendsView = new LongWeekendsView(apiManager, storageManager);
    const eventsView = new EventsView(apiManager, storageManager);
    const weatherView = new WeatherView(apiManager, storageManager);
    const currencyView = new CurrencyView(apiManager, storageManager);
    const plansView = new PlansView(apiManager, storageManager);
    const views = {
        dashboard: dashboardView,
        holidays: holidaysView,
        "long-weekends": longWeekendsView,
        events: eventsView,
        weather: weatherView,
        currency: currencyView,
        "my-plans": plansView
    };
    new TabsRouter(views);
});
//# sourceMappingURL=main.js.map