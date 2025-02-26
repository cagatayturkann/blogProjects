import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import { env } from './config/env';
import Database from './config/database';
import { configurePassport } from './config/passport';
import routes from './routes';
import { logger } from './utils/logger';

/**
 * Main Application Entry Point
 * 
 * This file sets up the Express application, configures middleware,
 * connects to the database, and starts the server.
 */

// Create Express application
const app: Express = express();
const PORT: number = env.PORT;

/**
 * Database Connection
 * 
 * Connect to MongoDB using the connection string from environment variables.
 * The database connection is handled by the Database class.
 */
Database.connect(env.MONGODB_URI);

/**
 * Middleware Setup
 * 
 * Configure Express middleware for:
 * - CORS: Allow cross-origin requests
 * - JSON: Parse JSON request bodies
 * - URL-encoded: Parse URL-encoded request bodies
 * - Passport: Initialize authentication
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

/**
 * Passport Configuration
 * 
 * Set up authentication strategies (JWT, Google OAuth)
 */
configurePassport();

/**
 * API Routes
 * 
 * Mount all API routes under the /api prefix
 */
app.use('/api', routes);

/**
 * 404 Handler
 * 
 * Handle requests to routes that don't exist
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/**
 * Global Error Handler
 * 
 * Catch and process any errors that weren't handled in route handlers
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

/**
 * Start Server
 * 
 * Listen for incoming requests on the specified port
 */
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

/**
 * Unhandled Promise Rejection Handler
 * 
 * Catch any unhandled promise rejections to prevent app crashes
 */
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
});

/**
 * Uncaught Exception Handler
 * 
 * Catch any uncaught exceptions and exit the process
 */
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
}); 