import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/fileController';
import { getHealth } from '../controllers/healthController';
import auth from '../middleware/auth';
import dynamicRateLimiter from '../middleware/rateLimiter';
import { healthCheckMiddleware } from '../middleware/healthCheck';
import config from '../config/config';

const router = Router();

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      cb(new Error('Only CSV files are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Health check endpoint - no auth required
router.get('/health', getHealth);

// File upload endpoint - requires authentication, health check, and rate limiting
router.post(
  '/upload',
  auth,
  healthCheckMiddleware,
  dynamicRateLimiter,
  upload.single('file'),
  uploadFile
);

export default router; 