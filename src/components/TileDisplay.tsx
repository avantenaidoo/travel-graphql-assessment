import { Days } from '../types/weather';
import { formatDate } from '../utils/formatDate';
import '../styles/components/tileDisplay.css';

type TileDisplayProps = {
    tile: Days | null;
    onClose: () => void;
    showTile: boolean;
}

const TileDisplay = ({ tile, showTile, onClose }: TileDisplayProps) => {

    if (!tile) return null;

    const { datetime, temp, icon, description, windspeed, precip, pressure, humidity, feelslike } = tile;

    const formattedDate = formatDate(datetime).split(',').slice(0, 3).join(', '); 
    const weatherIcon = `https://github.com/visualcrossing/WeatherIcons/raw/refs/heads/main/SVG/2nd%20Set%20-%20Color/${icon}.svg`;

  return (
    <div className={`tile-display bg-cyan-900 p-3 rounded-t-xl shadow-lg text-xl font-light overflow-y-auto ${showTile ? 'visible' : ''}`} >
        <button className='close-tile' onClick={onClose} aria-label='Close display'>
            x
        </button>
        <h2 className='my-4'>{ formattedDate }</h2>
        <img src={weatherIcon} alt={icon} />
        <p className='text-3xl mb-4'>{ temp }°C</p>
        <p className="font-semibold mb-4 w-auto max-w-[calc(100%-40px)]" style={{ width: '285px' }}>{ description }</p>
        <p>Wind: { windspeed } km/h</p>
        <p>Precipitation: { precip } mm</p>
        <p>Pressure: { pressure } mb</p>
        <p>Humidity: { humidity }%</p>
        <p>Feelslike: { feelslike }°C </p>
    </div>
  )
}

export default TileDisplay