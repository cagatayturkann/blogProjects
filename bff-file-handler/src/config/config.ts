import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  auth: {
    username: process.env.BASIC_AUTH_USERNAME || 'admin',
    password: process.env.BASIC_AUTH_PASSWORD || 'secret',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '262144000', 10), // 250MB
    uploadDir: path.resolve(process.env.UPLOAD_DIR || './uploads'),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '10000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1', 10),
  },
  concurrency: {
    maxOperations: parseInt(process.env.MAX_CONCURRENT_OPERATIONS || '5', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: path.resolve(process.env.LOG_DIR || './logs'),
  },
};

export default config; 