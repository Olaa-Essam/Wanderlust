export default class ApiManager {
    // API keys and end points
    GetAvailableCountriesEndPoint = "https://date.nager.at/api/v3/AvailableCountries";
    GetStatesLocalEndPoint = "./src/assets/countries+states.json";
    GetPublicHolidaysEndPoint = "https://date.nager.at/api/v3/PublicHolidays";
    GetLongWeekendEndPoint = "https://date.nager.at/api/v3/LongWeekend";
    GetWeatherForecastEndPoint = "https://api.open-meteo.com/v1/forecast";
    GetEventsEndPoint = "https://app.ticketmaster.com/discovery/v2/events.json";
    EventsKey = "GtcjCX2QGqA6IGUleeRaaASA2UU1mpuX";
    GetExchangeRatesEndPoint = "https://v6.exchangerate-api.com/v6";
    ExchangeRatesKey = "22ed40f0d2070e439d22c10f";
    GetCurrenciesLocalEndPoint = "./src/assets/common-currency.json";
    GetCountryDetailsEndPoint = "https://api.restcountries.com/countries/v5";
    CountryDetailsKey = "rc_live_0f26acad85fa4ebc84e3d6b1d56b1db1";
    GetSunTimesEndPoint = "https://api.sunrise-sunset.org/json";
    constructor() { }
    // 1. Fetch Available Countries
    async fetchAvailableCountries() {
        try {
            const response = await fetch(this.GetAvailableCountriesEndPoint);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        }
        catch (error) {
            console.error("fetchAvailableCountries error:", error);
            return [];
        }
    }
    // 2. Fetch Public Holidays
    async fetchPublicHolidays(year, countryCode) {
        try {
            const response = await fetch(`${this.GetPublicHolidaysEndPoint}/${year}/${countryCode}`);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const rawData = await response.json();
            const formattedHolidays = rawData.map((holiday, i) => ({
                id: `${holiday.countryCode}${i + 1}`,
                date: holiday.date,
                localName: holiday.localName,
                name: holiday.name,
                types: holiday.types
            }));
            return formattedHolidays;
        }
        catch (error) {
            console.error("fetchPublicHolidays error:", error);
            return [];
        }
    }
    // 3. Fetch Long Weekends
    async fetchLongWeekends(year, countryCode) {
        try {
            const response = await fetch(`${this.GetLongWeekendEndPoint}/${year}/${countryCode}`);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        }
        catch (error) {
            console.error("fetchLongWeekends error:", error);
            return [];
        }
    }
    // 4. Fetch Weather Forecast
    async fetchWeather(lat, lng) {
        try {
            const url = `${this.GetWeatherForecastEndPoint}?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,precipitation&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max&timezone=auto`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const rawData = await response.json();
            const formattedWeather = {
                timezone: rawData.timezone,
                current: {
                    time: rawData.current.time,
                    temperature_2m: rawData.current.temperature_2m,
                    apparent_temperature: rawData.current.apparent_temperature,
                    weather_code: rawData.current.weather_code,
                    wind_direction_10m: rawData.current.wind_direction_10m,
                    wind_speed_10m: rawData.current.wind_speed_10m,
                    relative_humidity_2m: rawData.current.relative_humidity_2m,
                    precipitation: rawData.current.precipitation,
                },
                hourly: {
                    time: rawData.hourly.time,
                    temperature_2m: rawData.hourly.temperature_2m,
                    weather_code: rawData.hourly.weather_code,
                },
                daily: {
                    time: rawData.daily.time,
                    weather_code: rawData.daily.weather_code,
                    temperature_2m_max: rawData.daily.temperature_2m_max,
                    temperature_2m_min: rawData.daily.temperature_2m_min,
                    precipitation_probability_max: rawData.daily.precipitation_probability_max,
                    precipitation_sum: rawData.daily.precipitation_sum,
                    sunrise: rawData.daily.sunrise,
                    sunset: rawData.daily.sunset,
                    uv_index_max: rawData.daily.uv_index_max,
                },
            };
            return formattedWeather;
        }
        catch (error) {
            console.error("fetchWeather error:", error);
            return null;
        }
    }
    // 5. Fetch Ticketmaster Events
    async fetchEvents(countryCode, stateCode) {
        try {
            const url = `${this.GetEventsEndPoint}?countryCode=${countryCode}&stateCode=${stateCode}&apikey=${this.EventsKey}&size=21`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const rawEvents = data._embedded?.events || [];
            const formattedEvents = rawEvents.map((event) => {
                const rawVenues = event._embedded?.venues || [];
                const formattedVenues = rawVenues.map((v) => ({
                    name: v.name || "Unknown Venue",
                    city: {
                        name: v.city?.name || "Unknown City"
                    }
                }));
                const targetImage = (event.images || []).find((img) => img.ratio === "16_9" && img.width === 640 && img.height === 360);
                const finalImage = targetImage
                    ? {
                        url: targetImage.url,
                        width: targetImage.width,
                        height: targetImage.height,
                        ratio: targetImage.ratio
                    }
                    : {
                        url: event.images?.[0]?.url || "",
                        width: event.images?.[0]?.width || 0,
                        height: event.images?.[0]?.height || 0,
                        ratio: event.images?.[0]?.ratio || ""
                    };
                return {
                    id: event.id,
                    name: event.name,
                    type: event.classifications?.[0]?.segment?.name || "Event",
                    url: event.url,
                    image: finalImage,
                    dates: {
                        localDate: event.dates?.start?.localDate || "Unknown",
                        localTime: event.dates?.start?.localTime || "Unknown"
                    },
                    venues: formattedVenues[0]
                };
            });
            return formattedEvents;
        }
        catch (error) {
            console.error("fetchEvents error:", error);
            return [];
        }
    }
    // 6. Fetch Exchange Rates
    async fetchExchangeRates(baseCurrencyCode) {
        try {
            const url = `${this.GetExchangeRatesEndPoint}/${this.ExchangeRatesKey}/latest/${baseCurrencyCode}`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const rawData = await response.json();
            if (rawData.result === "success") {
                const formattedExchange = {
                    conversion_rates: rawData.conversion_rates,
                    time_last_update_utc: rawData.time_last_update_utc
                };
                return formattedExchange;
            }
            throw new Error("API response status was not success");
        }
        catch (error) {
            console.error("fetchExchangeRates error:", error);
            return null;
        }
    }
    // 7. Fetch Country Details
    async fetchCountryDetails(countryCode) {
        try {
            const url = `${this.GetCountryDetailsEndPoint}/codes.alpha_2/${countryCode}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": this.CountryDetailsKey,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const jsonResponse = await response.json();
            const target = jsonResponse.data?.objects?.[0];
            if (!target)
                return null;
            const rawCapital = target.capitals?.[0];
            const formattedCapital = {
                name: rawCapital?.name || "Unknown Capital",
                coordinates: {
                    lat: rawCapital?.coordinates?.lat ?? 0,
                    lng: rawCapital?.coordinates?.lng ?? 0
                }
            };
            const formattedLanguages = (target.languages || []).map((lang) => lang.name);
            const formattedCurrencies = (target.currencies || []).map((curr) => ({
                code: curr.code || "",
                name: curr.name || "",
                symbol: curr.symbol || ""
            }));
            const countryDetail = {
                name: {
                    common: target.names?.common || "",
                    official: target.names?.official || ""
                },
                capital: formattedCapital,
                region: target.region || "",
                subregion: target.subregion || "",
                area: target.area?.kilometers ?? 0,
                borders: target.borders || [],
                callingCode: target.calling_codes?.[0] || "0",
                carDrivingSide: target.cars?.driving_side || "right",
                continents: target.continents || [],
                coordinates: {
                    lat: target.coordinates?.lat ?? 0,
                    lng: target.coordinates?.lng ?? 0
                },
                currencies: formattedCurrencies,
                startOfWeek: target.date?.start_of_week || "sunday",
                languages: formattedLanguages,
                population: target.population || 0,
                link: target.links.google_maps,
                timezone: target.timezones[0]
            };
            return countryDetail;
        }
        catch (error) {
            console.error("fetchCountryDetails error:", error);
            return null;
        }
    }
    // 8. Fetch Sun Times
    async fetchSunTimes(lat, lng, timezone) {
        try {
            const url = `${this.GetSunTimesEndPoint}?lat=${lat}&lng=${lng}&tzid=${timezone}&formatted=1`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data.status === "OK" && data.results) {
                const formattedSunTimes = {
                    sunrise: data.results.sunrise || "",
                    sunset: data.results.sunset || "",
                    solar_noon: data.results.solar_noon || "",
                    day_length: data.results.day_length || "",
                    civil_twilight_begin: data.results.civil_twilight_begin || "",
                    civil_twilight_end: data.results.civil_twilight_end || ""
                };
                return formattedSunTimes;
            }
            return null;
        }
        catch (error) {
            console.error("fetchSunTimes error:", error);
            return null;
        }
    }
    // 9. Fetch Local Countries and States Data
    async fetchLocalCountriesAndStates(countryCode) {
        try {
            const response = await fetch(this.GetStatesLocalEndPoint);
            if (!response.ok)
                throw new Error(`Failed to fetch local countries json, status: ${response.status}`);
            const data = await response.json();
            const selectedCountry = data.find((d) => d.iso2 === countryCode.toLocaleUpperCase());
            if (selectedCountry && selectedCountry.states) {
                const formattedCountry = selectedCountry.states.map((state) => ({
                    stateCode: state.state_code,
                    name: state.name,
                    lat: state.latitude,
                    lng: state.longitude
                }));
                return formattedCountry;
            }
            return [];
        }
        catch (error) {
            console.error("fetchLocalCountriesAndStates error:", error);
            return [];
        }
    }
    // 10. Fetch Local Common Currency Data
    async fetchLocalCurrencies(currencyCode) {
        try {
            const response = await fetch(this.GetCurrenciesLocalEndPoint);
            if (!response.ok)
                throw new Error(`Failed to fetch local currencies json, status: ${response.status}`);
            const data = await response.json();
            const selectedCurrency = data[currencyCode.toLocaleUpperCase()];
            if (selectedCurrency) {
                const formattedCurrency = {
                    name: selectedCurrency.name,
                    code: selectedCurrency.code,
                    countryCode: selectedCurrency.countryCode
                };
                return formattedCurrency;
            }
            return null;
        }
        catch (error) {
            console.error("fetchLocalCurrencies error:", error);
            return null;
        }
    }
}
//# sourceMappingURL=APIManager.js.map