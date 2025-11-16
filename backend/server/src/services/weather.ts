import axios from 'axios';

interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  snowfall_sum: number[];
}

interface OpenMeteoForecast {
  daily: DailyData;
}

export interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
  snowfallSum: number;
}

export interface WeatherForecast {
  daily: DailyWeather[];
}

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export const getForecast = async (
  lat: number,
  lng: number,
  days: number = 7
): Promise<WeatherForecast> => {
  const { data } = await axios.get<OpenMeteoForecast>(FORECAST_URL, {
    params: {
      latitude: lat,
      longitude: lng,
      daily:
        'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,snowfall_sum',
      forecast_days: days,
      timezone: 'auto',
    },
  });

  const d = data.daily;
  return {
    daily: d.time.map((date, i) => ({
      date,
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      precipitationSum: d.precipitation_sum[i],
      windSpeedMax: d.wind_speed_10m_max[i],
      snowfallSum: d.snowfall_sum[i],
    })),
  };
};

export const rankActivities = (forecast: WeatherForecast): Activity[] => {
  const days = forecast.daily;
  const avg = (key: keyof DailyWeather) =>
    days.reduce((s, d) => s + (d[key] as number), 0) / days.length;
  const total = (key: keyof DailyWeather) =>
    days.reduce((s, d) => s + (d[key] as number), 0);

  const tempAvg = (avg('tempMax') + avg('tempMin')) / 2;
  const precipAvg = avg('precipitationSum');
  const windAvg = avg('windSpeedMax');
  const snowTotal = total('snowfallSum');

  const scores: Record<string, number> = {
    SKIING: Math.min(1, (snowTotal > 0 ? 0.7 : 0) + (tempAvg < 0 ? 0.3 : 0) - (precipAvg > 5 ? 0.2 : 0)),
    SURFING: Math.min(1, (windAvg > 10 && windAvg < 30 ? 0.7 : 0) + (tempAvg > 20 ? 0.3 : 0) - (precipAvg > 5 ? 0.4 : 0)),
    INDOOR_SIGHTSEEING: Math.min(1, (precipAvg > 5 || tempAvg < 10 || tempAvg > 30 ? 0.9 : 0.5) - (windAvg > 20 ? 0.2 : 0)),
    OUTDOOR_SIGHTSEEING: Math.min(1, (tempAvg > 10 && tempAvg < 30 ? 0.8 : 0.4) - (precipAvg > 2 ? 0.5 : 0) - (windAvg > 15 ? 0.3 : 0)),
  };

  const max = Math.max(...Object.values(scores));
  return Object.entries(scores)
    .map(([name, score]) => ({
      name: name as keyof typeof ActivityName,
      suitabilityScore: max ? score / max : 0,
      rank: 0,
    }))
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .map((a, i) => ({ ...a, rank: i + 1 }));
};

export interface Activity {
  name: keyof typeof ActivityName;
  rank: number;
  suitabilityScore: number;
}