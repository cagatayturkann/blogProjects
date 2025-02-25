import { Request, Response, NextFunction } from 'express';
import healthService from '../services/healthService';
import logger from '../utils/logger';

export const healthCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Skip health check endpoint itself
    if (req.path === '/health') {
      next();
      return;
    }

    const health = await healthService.getHealth();
    logger.info('Health check middleware status', {
      path: req.path,
      method: req.method,
      healthStatus: health.status,
      metrics: health.metrics,
    });

    if (health.status === 'unhealthy') {
      logger.warn('Request rejected due to unhealthy system state', {
        path: req.path,
        method: req.method,
        metrics: health.metrics,
      });
      
      // End the request here, don't call next()
      res.status(503).json({
        error: 'System is currently unavailable due to high load',
        retryAfter: 60, // Suggest retry after 1 minute
        metrics: {
          cpuPressure: health.metrics.cpuPressure,
          memoryUsage: health.metrics.memoryUsage.usagePercentage
        }
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Error in health check middleware', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      method: req.method,
    });
    
    // If we can't check health, reject the request
    res.status(503).json({
      error: 'System health check failed',
      retryAfter: 60,
    });
  }
}; 