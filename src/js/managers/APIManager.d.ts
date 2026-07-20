import type { ICountry, ICountryDetails, ICountryState, IPublicHoliday, ILongWeekend, IWeather, ITicketmasterEvent, IExchangeRateResponse, ILocalCurrenciesData, ISunriseSunset } from "../interfaces/interfaces";
export default class ApiManager {
    private readonly GetAvailableCountriesEndPoint;
    private readonly GetStatesLocalEndPoint;
    private readonly GetPublicHolidaysEndPoint;
    private readonly GetLongWeekendEndPoint;
    private readonly GetWeatherForecastEndPoint;
    private readonly GetEventsEndPoint;
    private readonly EventsKey;
    private readonly GetExchangeRatesEndPoint;
    private readonly ExchangeRatesKey;
    private readonly GetCurrenciesLocalEndPoint;
    private readonly GetCountryDetailsEndPoint;
    private readonly CountryDetailsKey;
    private readonly GetSunTimesEndPoint;
    constructor();
    fetchAvailableCountries(): Promise<ICountry[]>;
    fetchPublicHolidays(year: string, countryCode: string): Promise<IPublicHoliday[]>;
    fetchLongWeekends(year: string, countryCode: string): Promise<ILongWeekend[]>;
    fetchWeather(lat: string | number, lng: string | number): Promise<IWeather | null>;
    fetchEvents(countryCode: string, stateCode: string): Promise<ITicketmasterEvent[]>;
    fetchExchangeRates(baseCurrencyCode: string): Promise<IExchangeRateResponse | null>;
    fetchCountryDetails(countryCode: string): Promise<ICountryDetails | null>;
    fetchSunTimes(lat: string | number, lng: string | number, timezone: string): Promise<ISunriseSunset | null>;
    fetchLocalCountriesAndStates(countryCode: string): Promise<ICountryState[]>;
    fetchLocalCurrencies(currencyCode: string): Promise<ILocalCurrenciesData | null>;
}
//# sourceMappingURL=APIManager.d.ts.map