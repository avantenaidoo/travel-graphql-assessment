import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/weatherServiceB';
import { VisualCrossingApiResponse } from '../types/weather';

const useWeatherByDays = (cityName: string, startDate: string, endDate: string) => {

    const [weatherDays, setWeatherDays] = useState<VisualCrossingApiResponse | null>(null);
    const [loadingDays, setLoadingDays] = useState(true);
    const [errorDays, setErrorDays] = useState<Error | null>(null);

    useEffect(() => {
        
        if (!cityName) return;

        setWeatherDays(null);
        setErrorDays(null);

        const fetchData = async () => {
            setLoadingDays(true);
            
            try {
                const data = await getWeatherData(cityName, startDate, endDate); 
                setWeatherDays(data); 
                
            } catch (error) {
                if (error instanceof Error) {
                    setErrorDays(error); 
                } else {
                    console.log('Unknown error:', error);
                    setErrorDays(new Error('An unknown error occurred while fetching weather data.')); 
                }
            } finally {
                setLoadingDays(false); 
            }
        };

        fetchData(); 

    }, [cityName, startDate, endDate]); 
    return { weatherDays, loadingDays, errorDays };
};

export default useWeatherByDays;