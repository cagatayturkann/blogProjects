import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todo.routes';

/**
 * Main Routes Configuration
 * 
 * This file serves as the central hub for all API routes.
 * It imports and configures route modules for different features
 * and mounts them at their respective endpoints.
 * 
 * All routes defined here will be accessible under the /api prefix
 * as configured in the main application file.
 */

const router = Router();

/**
 * Feature Routes
 * 
 * Mount feature-specific route modules:
 * - /api/auth: Authentication routes (register, login, profile)
 * - /api/todos: Todo management routes (CRUD operations)
 */
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

/**
 * Health Check Route
 * 
 * GET /api/health
 * 
 * A simple endpoint to verify that the API is running.
 * Returns basic information about the API status.
 * This can be used by monitoring tools or load balancers.
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router; 