import express from "express";
import type { Request, Response } from "express";
import type { NextFunction } from "express";
import cors from "cors";
import { logErrors, logEvents, logRequests } from "./middleware/logEvents.js";
import apiRoutes from "./routes/apiRoutes.js";
import { config } from "./config/config.js";
import limiter from "./middleware/rateLimiter.js";
import cron from "node-cron";
import { cleanupAllLogs } from "./utils/cleanupLogs.js";

// Create the Express app
const app = express();
const PORT = config.port || 3000;

app.set('trust proxy', 1);

app.use('/api/', limiter);

// Middleware to handle JSON
app.use(express.json());

// Log events
app.use(async (request: Request, response: Response, next: NextFunction) => {
  response.on('finish', async () => {
    await logEvents('Received request for weather data.');

  });
  next();
});

// Enable CORS for specific origins
app.use(cors({
  origin: ['http://localhost:5173','https://avantenaidoo.github.io'],
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  maxAge: 600
}));

// Custom Middleware logger
app.use(logRequests);


// Use the API routes
app.use("/api", apiRoutes);

app.get("/", (request: Request, response: Response) => {
  response.send("Welcome to the Weather App!");
});

// log errors
app.all('*', logErrors);

cron.schedule('* * * * *', async () => {
  console.log('Starting log cleanup job...');
  await cleanupAllLogs();
  console.log('Log cleanup job completed.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
