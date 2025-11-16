// WeatherStack API response and types
export interface WeatherData {
  request: Request;
  location: Location;
  current: Current;
  
}
export interface Request {
  type: string;
  query: string;
  language: string;
  unit: string;
}

export interface Location {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  timezone_id: string;
  localtime: string;
  localtime_epoch: number;
  utc_offset: string;
}

export interface Current {
  observation_time: string;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  is_day: string;
}

export interface WeatherStackAPIResponse {
  request: Request;
  location: Location;
  current: Current;
  success: boolean;
  error: {code: number, info: string};
}

// Visual Crossing API response and types
export interface VisualCrossingApiResponse {
  queryCost?:         number;
  latitude:          number;
  longitude:         number;
  resolvedAddress:   string;
  address:           string;
  timezone:          string;
  tzoffset:          number;
  days:              Days[];
  stations?:          { [key: string]: Station };
  currentConditions: CurrentConditions;
}

export interface Days {
  datetime:       string;
  datetimeEpoch:  number;
  temp:           number;
  feelslike:      number;
  humidity:       number;
  dew:            number;
  precip:         number;
  precipprob:     number;
  snow:           number;
  snowdepth:      number;
  preciptype:     string[] | null;
  windgust:       number;
  windspeed:      number;
  winddir:        number;
  pressure:       number;
  visibility:     number;
  cloudcover:     number;
  solarradiation: number;
  solarenergy:    number;
  uvindex:        number;
  conditions:     string;
  icon:           string;
  stations:       string[] | null;
  source:         string;
  sunrise:        string;
  sunriseEpoch:   number;
  sunset:         string;
  sunsetEpoch:    number;
  moonphase:      number;
  tempmax?:       number;
  tempmin?:       number;
  feelslikemax?:  number;
  feelslikemin?:  number;
  precipcover?:   number;
  severerisk?:    number;
  description?:   string;
}