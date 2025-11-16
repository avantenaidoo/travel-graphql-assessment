import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import type { Request, Response } from 'express';
import type { NextFunction } from 'express-serve-static-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Logs for specific log files to be created for logs
const logDirPath = join(__dirname, '..', 'logs');
const logFilePath = join(logDirPath, 'events.log');
const errLogPath = join(logDirPath, 'errors.log');
const reqLogPath = join(logDirPath, 'reqLogs.log');

// Create logs directory
const createLogDir = async () => {
    try {
        await fs.mkdir(logDirPath, { recursive: true });
    } catch (error) {
        console.error(`Failed to create logs directory: ${error}`)
    }
};

createLogDir();

// Initialize the event logger 
const initializeLogEvents = () => {
    const logId = uuidv4();
    const datetime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    return { logId, datetime };
};

// Helper function 
const logToFile = async (filePath: string, logItem: string): Promise<void> => {
    try {
        await fs.appendFile(filePath, logItem);

    } catch (error) {
        const { logId, datetime } = initializeLogEvents();
        const errorLogItem = `${datetime}\t${logId}\tERROR\tFailed to log: ${error}\n`;
        await fs.appendFile(errLogPath, errorLogItem);  
        console.error(`Failed to log error: ${error}`);
    }
};

// Log requests
const logRequests = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const { logId, datetime } = initializeLogEvents();

    response.on('finish', async () =>{
        const logItem = `${datetime}\t${logId}\tREQUEST\t${request.method}\t${request.headers.origin || 'unknown'}\t${request.originalUrl}\t${response.statusCode}: ${response.statusMessage}\n`;
        await logToFile(reqLogPath, logItem);
    });
    // next Middleware
    next();
};

// Log events
const logEvents = async (message: string): Promise<void> => {
    const { logId, datetime } = initializeLogEvents();
    const logItem = `${datetime}\t${logId}\tINFO\t${message}\n`;
    await logToFile(logFilePath, logItem); 
};

// Log errors
const logErrors = async (error: Error, request: Request, response: Response, next: NextFunction): Promise<void> => {
    const { logId, datetime } = initializeLogEvents();
    const logItem = `${datetime}\t${logId}\tERROR\t${error.name}\t${error.message}\n`;
    await logToFile(errLogPath, logItem); 

    next(error);
};

export { logErrors, logEvents, logRequests };