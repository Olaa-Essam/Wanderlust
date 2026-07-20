export interface ICountry {
    countryCode: string;
    name: string;
}
interface ICountryLanguages {
    [languageCode: string]: string;
}
interface ICountryCurrencies {
    [currencyCode: string]: {
        name: string;
        symbol: string;
    };
}
interface ICountryName {
    common: string;
    official: string;
}
interface ICountryFlags {
    png: string;
    svg: string;
}
interface ICountryCar {
    signs: string[];
    side: string;
}
export interface ICountryDetail {
    name: ICountryName;
    capital: string[];
    capitalInfo: {
        latlng: number[];
    };
    region: string;
    subregion: string;
    population: number;
    area: number;
    borders?: string[];
    languages: ICountryLanguages;
    currencies: ICountryCurrencies;
    timezones: string[];
    flags: ICountryFlags;
    car: ICountryCar;
    startOfWeek: string;
    maps: {
        googleMaps: string;
    };
    continents: string[];
}
export interface IPublicHoliday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string[] | null;
    launchYear: number | null;
    types: string[];
}
export interface ILongWeekend {
    startDate: string;
    endDate: string;
    dayCount: number;
    needBridgeDay: boolean;
}
interface ICurrentWeather {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
}
interface IDailyForecast {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
}
interface ICurrentUnits {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    weather_code: string;
    wind_speed_10m: string;
}
interface IDailyUnits {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    sunrise: string;
    sunset: string;
}
export interface IWeatherResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: ICurrentUnits;
    current: ICurrentWeather;
    daily_units: IDailyUnits;
    daily: IDailyForecast;
}
interface IEventImage {
    url: string;
    width: number;
    height: number;
}
interface IEventDates {
    start: {
        localDate: string;
        localTime?: string;
    };
    status: {
        code: string;
    };
}
interface IEventClassification {
    segment: {
        id: string;
        name: string;
    };
    genre: {
        name: string;
    };
}
interface IEventPriceRange {
    type: string;
    currency: string;
    min: number;
    max: number;
}
interface IEventVenue {
    name: string;
    city: {
        name: string;
    };
    state: {
        name: string;
    };
    country: {
        name: string;
    };
}
interface ITicketmasterEvent {
    name: string;
    type: string;
    id: string;
    url: string;
    dates: IEventDates;
    classifications: IEventClassification[];
    images: IEventImage[];
    priceRanges?: IEventPriceRange[];
    _embedded?: {
        venues: IEventVenue[];
    };
}
export interface IEventsResponse {
    _embedded?: {
        events: ITicketmasterEvent[];
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}
interface IConversionRates {
    [currencyCode: string]: number;
}
export interface IExchangeRateResponse {
    result: string;
    documentation: string;
    terms_of_use: string;
    time_last_update_unix: number;
    time_last_update_utc: string;
    time_next_update_unix: number;
    time_next_update_utc: string;
    base_code: string;
    conversion_rates: IConversionRates;
}
export interface IPairConversionResponse {
    result: string;
    base_code: string;
    target_code: string;
    conversion_rate: number;
    conversion_result: number;
}
interface ISunriseSunsetResults {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    day_length: number;
    civil_twilight_begin: string;
    civil_twilight_end: string;
    nautical_twilight_begin: string;
    nautical_twilight_end: string;
    astronomical_twilight_begin: string;
    astronomical_twilight_end: string;
}
export interface ISunriseSunsetResponse {
    results: ISunriseSunsetResults;
    status: string;
}
export {};
//# sourceMappingURL=interfaces.type.d.ts.map