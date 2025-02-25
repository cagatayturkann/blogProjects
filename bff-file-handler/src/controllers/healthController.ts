import { Request, Response } from 'express';
import healthService from '../services/healthService';
import logger from '../utils/logger';

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  const requestId = req.headers['x-request-id'] || 'unknown';

  try {
    logger.info('Health check request received', { requestId });

    const health = await healthService.getHealth();

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json({
      ...health,
      requestId,
    });
  } catch (error) {
    logger.error('Error in health check controller', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    res.status(500).json({
      status: 'unhealthy',
      error: 'Internal server error',
      requestId,
    });
  }
};
