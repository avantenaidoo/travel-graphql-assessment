import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { config } from '../config/config.js';

// Controller function to fetch data from the API
export const getWeatherStackData = async (req: Request, res: Response): Promise<void> => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }

  const { city } = req.query;
  try {
    const response = await fetch(`${config.weatherStackUrl}?access_key=${config.weatherStackApiKey}&query=${city}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from WeatherStack API" });
  }
};

export const getVisualCrossingData = async (req: Request, res: Response): Promise<void> => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }

  const { cityName, startDate, endDate } = req.query;
  try {
    const response = await fetch(`${config.visualCrossingUrl}/${cityName}/${startDate}/${endDate}?unitGroup=metric&include=days,current&key=${config.visualCrossingApiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Visual Crossing Weather API" });
  }
};