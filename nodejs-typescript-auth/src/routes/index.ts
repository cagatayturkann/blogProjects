import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todo.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router; 