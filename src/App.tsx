import { useState, useEffect } from 'react';
import CurrentWeather from './components/CurrentWeather';
import SearchBar from './components/SearchBar';
import WeatherGrid from './components/WeatherGrid';
import useWeatherData from './hooks/useWeatherData'; 
import { calculateDates } from './utils/calculateDates';
import useWeatherByDays from './hooks/useWeatherByDays';
import { Days } from './types/weather';
import OfflineNotifier from './components/OfflineNotifier';
import './styles/components/a11y.css';
import TileDisplay from './components/TileDisplay';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  
  const [city, setCity] = useState<string>(''); 
  const [tile, setTile] = useState<Days | null>(null);
  const [showTile, setShowTile] = useState<boolean>(false);
  const [delayRender, setDelayRender] = useState<boolean>(false);
  

  const { weatherData, loading, error } = useWeatherData(city);

  // Extract city name from weatherData for Visual Crossing url endpoint
  //const cityName = error? city : weatherData?.location.name || '';
  const cityName = city === ''? '': error ? city : weatherData?.location.name || '';


  // Extract localtime from weatherData
  const localtime = error ? new Date().toISOString() : weatherData?.location.localtime || '';

  // Calculate dates for Visual Crossing url endpoint
  const { startDate, endDate } = calculateDates(localtime);

  const { weatherDays } = useWeatherByDays(cityName, startDate, endDate);

  const currentWeather = error ? weatherDays : weatherData;

  const handleSearch = (city: string) => {

    setCity(city); 
  };

  const handleTileClick = (day: Days) => {
    setTile(day);

    setTimeout(() => {
      setShowTile(true);
    }, 50);
  };

  const handleCloseTile = () => {
    setShowTile(false);
  };

  useEffect(() => {

    if (error) {
      const timer = setTimeout(() => {
        setDelayRender(true);  
      }, 3000);
  

      return () => clearTimeout(timer);
    } else {

      setDelayRender(true);
    }
  }, [error]);  

  return (
    <div className="app-container 
    md:p-8 md:text-lg md:shadow-md
    lg:p-10 lg:text-xl lg:shadow-lg lg:bg-contain
    xl:p-12 xl:text-2xl xl:shadow-xl xl:bg-auto
    ">
      <h1 className="offscreen">Responsive Weather App</h1>

      {/* Show theme toggle */}
      <ThemeToggle />

      {/* Show offline component */}
      <OfflineNotifier />

      {/* Pass handleSearch function and loading state to SearchBar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Show weather data in CurrentWeather value either weatherStack or visual crossing*/}
      <CurrentWeather currentWeather={currentWeather} error={error} />

      {/* Conditionally render with delay if error from api1. Pass weatherDays to WeatherGrid */}
      {delayRender && (
        <WeatherGrid weatherDays={ weatherDays?.days || null } onTileClick={ handleTileClick }/>
        )}

      {/* Show selected tile in TileDisplay */}
      <TileDisplay tile={tile} onClose={handleCloseTile} showTile={showTile}/>     

      <div className="credits opacity-60">
        <p><a href="https://www.visualcrossing.com/weather-api" target="_blank" rel="noreferrer">Visual Crossing Weather API</a> &
        <a href="https://weatherstack.com" target='_blank' rel='noreferrer'>WeatherStack API</a></p>
      </div>
    </div>
  );
};

export default App;