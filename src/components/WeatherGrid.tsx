import { useState, useEffect } from 'react';
import { Days } from '../types/weather';
import { formatDate } from '../utils/formatDate';
import '../styles/components/weatherGrid.css';

type WeatherGridProps = {
    weatherDays : Days[] | null;
    onTileClick : (day: Days) => void;
}

const WeatherGrid = ({ weatherDays, onTileClick }: WeatherGridProps) => {
    const [delayRender, setDelayRender] = useState<boolean>(false);

    const displayDays = weatherDays?.filter((_, index) => [0, 1, 2, 4, 5, 6].includes(index)).map((day) => ({
        formattedDate : formatDate(day.datetime).split(',')[0],
        temperature : day.temp,
        weatherIcon : `https://github.com/visualcrossing/WeatherIcons/raw/refs/heads/main/SVG/2nd%20Set%20-%20Color/${day.icon}.svg`,
        iconAlt : day.icon,
    }));

    useEffect(() => {
        if (weatherDays) {
          setDelayRender(false);
          const timer = setTimeout(() => {
            setDelayRender(true); 
          }, 50);
    
          return () => clearTimeout(timer);
        }
      }, [weatherDays]);

    if (!displayDays) return null;

  return (
    <div className={`grid-container ${delayRender ? 'visible' : ''}`}>
        <div className="daily-tiles">
            {/* Display each day tile */}
            { displayDays?.map((day, index) => (
                <button className='btn-tile' key={index} type="button" onClick={() => onTileClick(weatherDays![[0, 1, 2, 4, 5, 6][index]])}>
                    <p>{ day.formattedDate }</p>
                    <img src={day.weatherIcon} alt={day.iconAlt} className='w-10 h-10' />
                    <p>{ day.temperature }°</p>
                </button>
            ))}
        </div>
    </div>
  )
}

export default WeatherGrid