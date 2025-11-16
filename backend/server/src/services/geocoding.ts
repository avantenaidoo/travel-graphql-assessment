import axios from 'axios';

interface OpenMeteoCity {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface OpenMeteoResponse {
  results?: OpenMeteoCity[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  admin1: string | null;
  lat: number;
  lng: number;
}

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const citySuggestions = async (name: string): Promise<City[]> => {
  try {
    const { data } = await axios.get<OpenMeteoResponse>(GEO_URL, {
      params: { name, count: 10, language: 'en', format: 'json' },
    });

    if (!data.results) return [];

    return data.results.map((c, i) => ({
      id: `${c.latitude}-${c.longitude}-${i}`,
      name: c.name,
      country: c.country,
      admin1: c.admin1 || null,
      lat: c.latitude,
      lng: c.longitude,
    }));
  } catch (error) {
    throw new Error(`Geocoding failed: ${(error as Error).message}`);
  }
};