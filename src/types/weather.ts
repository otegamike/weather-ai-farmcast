export interface WeatherLocation {
  lat: number;
  lon: number;
  timezone: string;
  country: string;
  requested_lat?: number;
  requested_lon?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wind_gust: number;
  uv_index: number;
  condition_code: string;
  icon: string;
  icon_path: string;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_gust: number;
  uv_index: number;
  precipitation_probability: number;
  condition_code: string;
  icon: string;
  icon_path: string;
}

export interface DailyWeather {
  date: string;
  temp_min: number;
  temp_max: number;
  precipitation_sum: number;
  precipitation_probability: number;
  wind_max: number;
  sunrise: string;
  sunset: string;
  condition_code: string;
  icon: string;
  icon_path: string;
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  ai_summary?: string;
  client_geo?: {
    country: string;
    ip_hash: string;
  };
}

export interface UsageResponse {
  plan: string;
  requests_used: number;
  requests_limit: number;
  requests_remaining: number;
  ai_requests_used: number;
  ai_requests_limit: number;
  period_start: string;
  period_end: string;
}
