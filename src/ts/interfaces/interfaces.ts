// ==========================================
// 1. Dashboard View Interfaces
// ==========================================

export interface ICountry {
  countryCode: string;
  name: string;
}

export interface ICountryCurrencies {
  code: string;
  name: string;
  symbol: string;
}

interface ICountryName {
  common: string;
  official: string;
}

export interface ICountryCapital {
  name: string;
  coordinates: ICoordinates;
}

interface ICoordinates {
  lat: number | string;
  lng: number | string;
}

export interface ICountryState extends ICoordinates {
  name : string;
  stateCode: string;
}

export interface ICountryDetails {
  name: ICountryName;
  capital: ICountryCapital;
  region: string;
  subregion: string;
  area: number;
  borders?: string[];
  callingCode: string | number;
  carDrivingSide: string;
  continents: string[];
  coordinates: ICoordinates;
  currencies: ICountryCurrencies[];
  startOfWeek: string;
  languages: string[];
  population: number;
  link: string;
  timezone: string;
}

// ==========================================
// 2. Holidays View Interfaces
// ==========================================

export interface IPublicHoliday {
  id: string;
  date: string;
  localName: string;
  name: string;
  types: string[];
}

export interface ILongWeekend {
  startDate: string;
  endDate: string;
  dayCount: number;
  needBridgeDay: boolean;
}

// ==========================================
// 3. Weather View Interfaces
// ==========================================

interface ICurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  relative_humidity_2m: number;
  precipitation: number;
}

interface IHourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

interface IDailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[]
  precipitation_sum: number[]
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

export interface IWeather {
  timezone: string;
  current: ICurrentWeather;
  hourly: IHourlyWeather;
  daily: IDailyForecast;
}

// ==========================================
// 4. Events View Interfaces (Ticketmaster)
// ==========================================

export interface IEventImage {
  url: string;
  width: number;
  height: number;
  ratio: string;
}

interface IEventDates {
  localDate: string;
  localTime: string;
}

export interface IEventVenue {
  name: string;
  city: { 
    name: string 
  };
}

export interface ITicketmasterEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  image: IEventImage;
  dates: IEventDates;
  venues: IEventVenue;
}

// ==========================================
// 5. Currency Converter View Interfaces
// ==========================================


interface IConversionRates {
  [currencyCode: string]: number;
}

export interface ILocalCurrenciesData {
  name: string;
  code: string;
  countryCode: string;
}

export interface IExchangeRateResponse {
  conversion_rates: IConversionRates;
  time_last_update_utc: string;
}

// ==========================================
// 6. Sunrise & Sunset View Interfaces
// ==========================================

export interface ISunriseSunset {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: string;
  civil_twilight_begin: string;
  civil_twilight_end: string;
}

// ==========================================
// 7. Saved Plans Interface
// ==========================================

interface IBaseSavedItem {
  id: string;
  type: 'holiday' | 'event' | 'long weekend';
  title: string;
}

interface ISavedEventItem extends IBaseSavedItem {
  location: IEventVenue;
  date: IEventDates;
}

interface ISavedHolidayItem extends IBaseSavedItem {
  description: string;
  date: string;
}

interface ISavedLongWeekendsItem extends IBaseSavedItem {
  startDate: string;
  endDate: string;
  note: string;
}

export type TSavedItem = ISavedEventItem | ISavedHolidayItem | ISavedLongWeekendsItem;

// ==========================================
// 8. Storage Interface
// ==========================================

export interface IWanderlustStorage {
  activeCountry: {name: string, code: string};
  activeYear: string;
  activeState: string;
  timezone: string;
  savedPlans: TSavedItem[]; 
}