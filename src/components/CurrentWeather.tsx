import { useState, useEffect } from 'react';
import { VisualCrossingApiResponse, WeatherData } from '../types/weather';
import { formatDate } from '../utils/formatDate';
import '../styles/components/currentWeather.css';

type CurrentWeatherProps = {
  currentWeather: WeatherData | VisualCrossingApiResponse | null;
  error: Error | null;
};

const CurrentWeather = ({ currentWeather, error }: CurrentWeatherProps) => {

  const [delayRender, setDelayRender] = useState<boolean>(false); 
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);


  useEffect(() => {
    if (currentWeather) {

      setDelayRender(false);

      const timer = setTimeout(() => {
        setDelayRender(true);
      }, 50); 

      return () => clearTimeout(timer); 
    }
  }, [currentWeather]); 

  if (showError && error) {
    return (
      <div className="display-error bg-slate-50 bg-opacity-25 font-bold text-sm italic text-gray-950 text-center" role="alert" aria-labelledby="CurrentWeatherError">
        <p id="CurrentWeatherError">Error: {error.message}</p>
      </div>
    );
  }


  let name, country, weatherIcon, weatherDescription, temperature, wind_speed, precip, pressure, humidity, feelslike, displayDate;

  if (currentWeather && 'currentConditions' in currentWeather) {
    const { currentConditions, address, resolvedAddress } = currentWeather;
    name = address;
    country = resolvedAddress.split(',').pop()?.trim();
    weatherIcon = `https://github.com/visualcrossing/WeatherIcons/raw/refs/heads/main/SVG/2nd%20Set%20-%20Color/${currentConditions.icon}.svg`;
    weatherDescription = currentConditions.conditions;
    temperature = currentConditions.temp;
    wind_speed = currentConditions.windspeed;
    precip = currentConditions.precip;
    pressure = currentConditions.pressure;
    humidity = currentConditions.humidity;
    feelslike = currentConditions.feelslike;

    const localtime = currentConditions.datetime.split(":").slice(0, 2).join(":");
    displayDate = `Today, ${localtime}`;
  }

  if (currentWeather && 'location' in currentWeather) {
    const { location, current } = currentWeather;
    weatherIcon = current?.weather_icons?.[0];
    weatherDescription = current?.weather_descriptions?.[0];
    name = location?.name;
    country = location?.country;
    temperature = current?.temperature;
    wind_speed = current?.wind_speed;
    precip = current?.precip;
    pressure = current?.pressure;
    humidity = current?.humidity;
    feelslike = current?.feelslike;
    displayDate = formatDate(location?.localtime);
  }

  if (!currentWeather) return null;

  return (
    <div className={`current-display ${delayRender ? 'visible' : ''} bg-slate-50 bg-opacity-25 p-3 rounded-xl shadow-lg max-w-lg mx-auto mb-3`} role="region" aria-labelledby="CurrentWeather">
      <h2 id="CurrentWeather" className="font-bold text-2xl text-center mb-6">{name}</h2>

      <div className="flex justify-center items-center space-x-11 mb-6">
        {/* Temperature */}
        <p className="temp-result text-6xl text-center">
          {temperature}°<span className="text-xl">C</span>
        </p>

        {/* Weather Icon */}
        {weatherIcon && (
          <img className="weather-icon object-contain" src={weatherIcon} alt={`Weather Icon showing ${weatherDescription}`} />
        )}
      </div>

      {/* Location */}
      <div className="text-center">
        <p className="text-lg">{country}</p>
        <p className="text-sm">{displayDate}</p>
      </div>

      {/* Weather Description and Other Details */}
      <div className="text-center font-normal mt-4">
        <p className="text-lg font-bold">{weatherDescription}</p>
        <p>Wind: {wind_speed} km/h</p>
        <p>Precipitation: {precip} mm</p>
        <p>Pressure: {pressure} mb</p>
        <p>Humidity: {humidity}%</p>
        <p>Feels Like: {feelslike}°C</p>
      </div>
    </div>
  );
};

export default CurrentWeather;
