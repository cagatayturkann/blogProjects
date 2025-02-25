import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import os from 'os';
import config from '../config/config';
import logger from '../utils/logger';

const getSystemLoad = (): { cpuLoad: number; memoryUsage: number } => {
  const cpuLoad = os.loadavg()[0] / os.cpus().length; // Normalized CPU load
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsage = (totalMemory - freeMemory) / totalMemory;

  return { cpuLoad, memoryUsage };
};

const getDynamicWindow = (): number => {
  const { cpuLoad, memoryUsage } = getSystemLoad();
  const baseWindow = config.rateLimit.windowMs;

  // Increase window time (slow down requests) when system is under pressure
  if (cpuLoad > 0.8 || memoryUsage > 0.8) {
    return baseWindow * 2;
  }
  
  return baseWindow;
};

const dynamicRateLimiter = rateLimit({
  windowMs: getDynamicWindow(),
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip rate limiting for health checks
  keyGenerator: (req: Request): string => req.ip || req.socket.remoteAddress || 'unknown',
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      systemLoad: getSystemLoad(),
    });
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(getDynamicWindow() / 1000),
    });
  },
});

export default dynamicRateLimiter; 