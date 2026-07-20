import Loading from "../utils/loading.js";
import Toast from "../utils/toast.js";
export default class WeatherView {
    apiManager;
    storageManager;
    // header elements
    weatherSelection;
    weatherSelectionCountryFlag;
    weatherSelectionCountryName;
    weatherSelectionCity;
    // content elements
    weatherEmptyState;
    // current weather elements
    weatherHeroCard;
    weatherCurrnetLocationElement;
    weatherCurrnetDateElement;
    weatherCurrnetIconElement;
    weatherCurrnetTempElement;
    weatherCurrnetConditionElement;
    weatherCurrnetFeelsElement;
    weatherCurrnetMaxElement;
    weatherCurrnetMinElement;
    // grid
    weatherGridHumidityElement;
    weatherGridHumidityPresentElement;
    weatherGridWindElement;
    weatherGridWindDirElement;
    weatherGridUVElement;
    weatherGridUVLevelElement;
    weatherGridRainElement;
    weatherGridRainMMElement;
    weatherGridSunriseTimeElement;
    weatherGridSunProgressElement;
    weatherGridSunsetTimeElement;
    // data
    weather = null;
    constructor(apiManager, storageManager) {
        this.apiManager = apiManager;
        this.storageManager = storageManager;
    }
    async activateView() {
        this.findElements();
        this.setSelection();
        if (this.storageManager.getActiveCountryCode() === "" || this.storageManager.getActiveState().lat === "" || this.storageManager.getActiveState().lng === "") {
            this.weatherEmptyState.classList.remove("hidden");
            const weatherCards = document.querySelectorAll("#weather-card");
            weatherCards.forEach((card) => {
                card.classList.add("hidden");
            });
        }
        else {
            this.weatherEmptyState.classList.add("hidden");
            const weatherCards = document.querySelectorAll("#weather-card");
            this.loadContent(this.storageManager.getActiveState().lat.toString(), this.storageManager.getActiveState().lng.toString());
            weatherCards.forEach((card) => {
                card.classList.remove("hidden");
            });
        }
    }
    findElements() {
        // header elements
        this.weatherSelection = document.getElementById("weather-selection");
        this.weatherSelectionCountryFlag = document.getElementById("weather-selection-country-flag");
        this.weatherSelectionCountryName = document.getElementById("weather-selection-country-name");
        this.weatherSelectionCity = document.getElementById("weather-selection-city");
        // content elements
        this.weatherEmptyState = document.getElementById("weather-empty-state");
        // current ELements
        this.weatherHeroCard = document.querySelector(".weather-hero-card");
        this.weatherCurrnetLocationElement = document.getElementById("weather-current-location");
        this.weatherCurrnetDateElement = document.getElementById("weather-current-date");
        this.weatherCurrnetIconElement = document.getElementById("weather-current-icon");
        this.weatherCurrnetTempElement = document.getElementById("weather-current-temp");
        this.weatherCurrnetConditionElement = document.getElementById("weather-current-condition");
        this.weatherCurrnetFeelsElement = document.getElementById("weather-current-feels");
        this.weatherCurrnetMaxElement = document.getElementById("weather-current-max");
        this.weatherCurrnetMinElement = document.getElementById("weather-current-min");
        // grid
        this.weatherGridHumidityElement = document.getElementById("weather-current-humidity");
        this.weatherGridHumidityPresentElement = document.getElementById("weather-current-humidity-present");
        this.weatherGridWindElement = document.getElementById("weather-current-wind");
        this.weatherGridWindDirElement = document.getElementById("weather-current-wind-dir");
        this.weatherGridUVElement = document.getElementById("weather-current-uv");
        this.weatherGridUVLevelElement = document.getElementById("weather-current-uv-level");
        this.weatherGridRainElement = document.getElementById("weather-current-rain");
        this.weatherGridRainMMElement = document.getElementById("weather-current-rain-mm");
        this.weatherGridSunriseTimeElement = document.getElementById("weather-current-sunrise-time");
        this.weatherGridSunProgressElement = document.getElementById("weather-current-sun-progress");
        this.weatherGridSunsetTimeElement = document.getElementById("weather-current-sunset-time");
    }
    setSelection() {
        if (this.storageManager.getActiveCountryCode() === "" || this.storageManager.getActiveState().name === "") {
            this.weatherSelection.classList.add("hidden");
            return;
        }
        this.weatherSelection.classList.remove("hidden");
        this.weatherSelectionCountryFlag.src = `https://flagcdn.com/w40/${this.storageManager.getActiveCountryCode().toLowerCase()}.png`;
        this.weatherSelectionCountryFlag.alt = this.storageManager.getActiveCountryName();
        this.weatherSelectionCountryName.innerText = this.storageManager.getActiveCountryName();
        this.weatherSelectionCity.innerText = this.storageManager.getActiveState().name;
    }
    async loadContent(lat, lng) {
        try {
            Loading.show("Loading");
            this.weather = await this.apiManager.fetchWeather(lat, lng);
            if (!this.weather) {
                throw new Error("Failed to load holidays");
            }
            this.storageManager.setTimezone(this.weather.timezone);
            this.renderCurrentWeather(this.weather);
            this.renderGridWeather(this.weather);
        }
        catch (error) {
            console.error(error);
            Toast.show("Failed to load weather", "error");
        }
        finally {
            Loading.hide();
        }
    }
    renderCurrentWeather(weather) {
        const weatherDetails = this.getWeatherDetails(weather.current.weather_code);
        this.weatherHeroCard.className = "weather-hero-card";
        this.weatherHeroCard.classList.add(weatherDetails.bgClass);
        this.weatherCurrnetLocationElement.innerText = this.storageManager.getActiveState().name;
        this.weatherCurrnetDateElement.innerText = this.getCurrentDateByTimezone(weather.timezone);
        this.weatherCurrnetIconElement.innerHTML = `<i class="${weatherDetails.icon}"></i>`;
        this.weatherCurrnetTempElement.innerText = weather.current.temperature_2m.toString();
        this.weatherCurrnetConditionElement.innerText = weatherDetails.text;
        this.weatherCurrnetFeelsElement.innerText = weather.current.apparent_temperature.toString();
        this.weatherCurrnetMaxElement.innerText = `${weather.daily.temperature_2m_max[0]}°`;
        this.weatherCurrnetMinElement.innerText = `${weather.daily.temperature_2m_min[0]}°`;
    }
    renderGridWeather(weather) {
        const uvIndex = this.getUvIndexDetails(weather.daily.uv_index_max[0]);
        this.weatherGridHumidityElement.innerText = `${weather.current.relative_humidity_2m}%`;
        this.weatherGridHumidityPresentElement.style.width = `${weather.current.relative_humidity_2m}%`;
        this.weatherGridWindElement.innerText = `${weather.current.wind_speed_10m} km/h`;
        this.weatherGridWindDirElement.innerText = this.getWindDirectionText(weather.current.wind_direction_10m);
        this.weatherGridUVElement.innerText = weather.daily.uv_index_max[0]?.toString();
        this.weatherGridUVLevelElement.innerText = uvIndex.text;
        this.weatherGridUVLevelElement.className = "uv-level";
        this.weatherGridUVLevelElement.classList.add(uvIndex.bgClass);
        this.weatherGridRainElement.innerText = `${weather.daily.precipitation_probability_max[0]}%`;
        this.weatherGridRainMMElement.innerText = `${weather.daily.precipitation_sum[0]}mm expected`;
        this.weatherGridSunriseTimeElement.innerText = this.formatTimeFromISO(weather.daily.sunrise[0]);
        this.weatherGridSunProgressElement.style = `--sun-progress: ${this.calculateSunProgress(weather.current.time, weather.daily.sunrise[0], weather.daily.sunset[0])};`;
        this.weatherGridSunsetTimeElement.innerText = this.formatTimeFromISO(weather.daily.sunset[0]);
    }
    getWeatherDetails(code) {
        switch (code) {
            case 0:
                return {
                    text: "Clear sky",
                    icon: "fa-solid fa-sun",
                    bgClass: "weather-sunny"
                };
            case 1:
                return {
                    text: "Mainly clear",
                    icon: "fa-solid fa-cloud-sun",
                    bgClass: "weather-cloudy"
                };
            case 2:
                return {
                    text: "Partly cloudy",
                    icon: "fa-solid fa-cloud-sun",
                    bgClass: "weather-cloudy"
                };
            case 3:
                return {
                    text: "Overcast",
                    icon: "fa-solid fa-cloud-sun",
                    bgClass: "weather-cloudy"
                };
            case 45:
                return {
                    text: "Fog",
                    icon: "fa-solid fa-smog",
                    bgClass: "weather-foggy"
                };
            case 48:
                return {
                    text: "depositing rime fog",
                    icon: "fa-solid fa-smog",
                    bgClass: "weather-foggy"
                };
            case 51:
                return {
                    text: "Drizzle Light",
                    icon: "fa-solid fa-cloud-rain",
                    bgClass: "weather-rainy"
                };
            case 53:
                return {
                    text: "Drizzle moderate",
                    icon: "fa-solid fa-cloud-rain",
                    bgClass: "weather-rainy"
                };
            case 55:
                return {
                    text: "Drizzle and dense",
                    icon: "fa-solid fa-cloud-rain",
                    bgClass: "weather-rainy"
                };
            case 61:
                return {
                    text: "Rain Slight",
                    icon: "fa-solid fa-cloud-showers-heavy",
                    bgClass: "weather-rainy"
                };
            case 63:
                return {
                    text: "Rain moderate",
                    icon: "fa-solid fa-cloud-showers-heavy",
                    bgClass: "weather-rainy"
                };
            case 65:
                return {
                    text: "Rain heavy",
                    icon: "fa-solid fa-cloud-showers-heavy",
                    bgClass: "weather-rainy"
                };
            case 71:
                return {
                    text: "Snow fall Slight",
                    icon: "fa-solid fa-snowflake",
                    bgClass: "weather-snowy"
                };
            case 73:
                return {
                    text: "Snow fall moderate",
                    icon: "fa-solid fa-snowflake",
                    bgClass: "weather-snowy"
                };
            case 75:
                return {
                    text: "Snow fall heavy",
                    icon: "fa-solid fa-snowflake",
                    bgClass: "weather-snowy"
                };
            case 80:
                return {
                    text: "Rain showers Slight",
                    icon: "fa-solid fa-cloud-sun-rain",
                    bgClass: "weather-rainy"
                };
            case 81:
                return {
                    text: "Rain showers moderate",
                    icon: "fa-solid fa-cloud-sun-rain",
                    bgClass: "weather-rainy"
                };
            case 82:
                return {
                    text: "Rain showers violent",
                    icon: "fa-solid fa-cloud-sun-rain",
                    bgClass: "weather-rainy"
                };
            case 95:
                return {
                    text: "Thunderstorm Slight",
                    icon: "fa-solid fa-cloud-bolt",
                    bgClass: "weather-stormy"
                };
            case 96:
                return {
                    text: "Thunderstorm moderate",
                    icon: "fa-solid fa-cloud-bolt",
                    bgClass: "weather-stormy"
                };
            case 99:
                return {
                    text: "Thunderstorm hail",
                    icon: "fa-solid fa-cloud-bolt",
                    bgClass: "weather-stormy"
                };
            default:
                return {
                    text: "Unknown weather condition",
                    icon: "fa-solid fa-cloud",
                    bgClass: "weather-default"
                };
        }
    }
    getCurrentDateByTimezone(timezone) {
        try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            });
            return formatter.format(now);
        }
        catch (error) {
            console.error("Invalid timezone provided:", error);
            return new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }).format(new Date());
        }
    }
    getWindDirectionText(degree) {
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        const index = Math.round(degree / 22.5) % 16;
        return directions[index];
    }
    formatTimeFromISO(isoString) {
        try {
            const date = new Date(isoString);
            const formatter = new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
            return formatter.format(date);
        }
        catch (error) {
            console.error("Error parsing ISO time:", error);
            return "00:00 AM";
        }
    }
    getUvIndexDetails(uvIndex) {
        if (uvIndex <= 2) {
            return { text: "Low", bgClass: "low" };
        }
        else if (uvIndex <= 5) {
            return { text: "Moderate", bgClass: "moderate" };
        }
        else if (uvIndex <= 7) {
            return { text: "High", bgClass: "high" };
        }
        else if (uvIndex <= 10) {
            return { text: "Very High", bgClass: "very-high" };
        }
        else {
            return { text: "Extreme", bgClass: "extreme" };
        }
    }
    calculateSunProgress(currentTime, sunriseTime, sunsetTime) {
        const currentMs = new Date(currentTime).getTime();
        const sunriseMs = new Date(sunriseTime).getTime();
        const sunsetMs = new Date(sunsetTime).getTime();
        if (currentMs <= sunriseMs) {
            return 0;
        }
        if (currentMs >= sunsetMs) {
            return 100;
        }
        const totalDaylightMs = sunsetMs - sunriseMs;
        const daylightPassedMs = currentMs - sunriseMs;
        const progress = (daylightPassedMs / totalDaylightMs) * 100;
        return Math.round(progress * 100) / 100;
    }
}
//# sourceMappingURL=weatherView.js.map