import app from './app';
import config from './config/config';
import logger from './utils/logger';
import fileUploadService from './services/fileUploadService';

const server = app.listen(config.server.port, () => {
  logger.info(`Server is running on port ${config.server.port}`);
  logger.info(`Environment: ${config.server.nodeEnv}`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');

  server.close(async () => {
    try {
      // Stop the cleanup interval
      fileUploadService.stopCleanup();
      
      // Clean up resources
      await fileUploadService.cleanup();
      
      // Flush logs
      logger.on('finish', () => {
        process.exit(0);
      });
      
      logger.info('Server shutdown complete');
      logger.end();
    } catch (error) {
      logger.error('Error during shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown); 