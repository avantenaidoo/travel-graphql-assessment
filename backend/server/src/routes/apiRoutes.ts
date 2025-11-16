import { Router } from "express";
import { originValidator, cityValidator, dateValidator, endDateValidator } from "../utils/validators.js";
import { getWeatherStackData, getVisualCrossingData } from "../controllers/apiController.js";

const router: Router = Router();

// Define the GET route for data which calls the controller function and apply validators
router.get("/weatherstack", 
    originValidator(),
    cityValidator("city"), 
    getWeatherStackData
);

router.get("/visualcrossing", 
    originValidator(),
    cityValidator("cityName"), 
    dateValidator("startDate"), 
    dateValidator("endDate"),
    endDateValidator(),
    getVisualCrossingData
);

export default router;
