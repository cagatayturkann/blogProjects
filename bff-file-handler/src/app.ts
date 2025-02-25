import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import routes from './routes';
import logger from './utils/logger';
import config from './config/config';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();

// Ensure upload directory exists
(async () => {
  try {
    await fs.access(config.upload.uploadDir);
  } catch {
    await fs.mkdir(config.upload.uploadDir, { recursive: true });
  }
})();

// Security middleware
app.use(helmet());
app.use(cors());

// Request ID middleware
app.use((req, res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
  next();
});

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    requestId: req.headers['x-request-id'],
  });

  res.status(500).json({
    error: 'Internal server error',
    requestId: req.headers['x-request-id'],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    requestId: req.headers['x-request-id'],
  });
});

export default app; 