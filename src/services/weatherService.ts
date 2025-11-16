  import { WeatherData, WeatherStackAPIResponse } from '../types/weather';

  //const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;

  // Backend url no api key
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchWeatherData = async (query: string): Promise<WeatherStackAPIResponse | null> => {
    
    if (!query.trim()) {
      throw new Error('No city name found, please try again.');
    }

    if (/[^a-zA-Z\s]/.test(query) || /\s{2,}/.test(query)) {
      throw new Error('Only letters and single spaces are allowed.');
    }

    const url = `${BASE_URL}/api/weatherstack?city=${query}`; 
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WeatherStackAPIResponse = await response.json();

      if (data.success === false) {
        // Known errors from the WeatherStack API
        switch (data.error.code) {
          case 101:
            throw new Error('Invalid API access key used.');
          case 601:
            throw new Error('Invalid city entered.');
          case 404:
            throw new Error('Invalid location.');
          case 104:
            throw new Error('WeatherStack API monthly rate limit reached. Please try again next month. Before you leave, count to 3 🍃');
          default:
            throw new Error(`😲 Whoops! There is no data for your search, "${query}". Please check your spelling or try a different city name 😁`);
        }
      }

      // Check if the city name in the response matches the query
      const normalizedQuery = query.toLowerCase().trim();
      const normalizedCityName = data.location.name.toLowerCase().trim();
      const normalizedCountryName = data.location.country.toLowerCase().trim();

      // Allow small variations of query entered by the user or if country entered for better UX

      if (normalizedCountryName === normalizedQuery || normalizedCityName === normalizedQuery) {
        return data;
      } else if (normalizedCityName.includes(normalizedQuery) || normalizedCountryName.includes(normalizedQuery)) {
        return data;
      }
    
      throw new Error(`😲 Whoops! There is no data for your search, "${query}". Please check your spelling or try a different city name 😁`);
      
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Unable to fetch data. Please check your connection.');
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  };

  export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
    const data = await fetchWeatherData(city);

    if (!data || !data.request || !data.location || !data.current) {
      return null; 
    }

    const { request, location, current } = data;

    return {
      request,
      location,
      current,
    };
  };