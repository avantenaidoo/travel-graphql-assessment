import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 20, 
	standardHeaders: true, 
	legacyHeaders: false, 
  
  keyGenerator: (request: Request, response: Response): Promise<string> => {
    return Promise.resolve(request.ip?.replace(/:\d+[^:]*$/, '') || '');
  },
  handler: (request: Request, response: Response) => {
    response.status(429).json({
      message: 'Too many requests, try again later.',
    });
  },
});

export default limiter;