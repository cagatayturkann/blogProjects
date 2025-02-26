import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

/**
 * Authentication Routes
 * 
 * This file defines all routes related to user authentication:
 * - User registration
 * - User login
 * - Profile retrieval
 * - Google OAuth authentication
 */

const router = Router();

/**
 * User Registration
 * 
 * POST /api/auth/register
 * 
 * Creates a new user account with email, password, and name.
 * Returns the created user and a JWT token.
 * 
 * Request body: { email, password, name }
 */
router.post('/register', authController.register.bind(authController));

/**
 * User Login
 * 
 * POST /api/auth/login
 * 
 * Authenticates a user with email and password.
 * Returns the user data and a JWT token.
 * 
 * Request body: { email, password }
 */
router.post('/login', authController.login.bind(authController));

/**
 * Get User Profile
 * 
 * GET /api/auth/profile
 * 
 * Retrieves the authenticated user's profile.
 * Requires authentication via JWT token.
 * 
 * Headers: { Authorization: "Bearer [token]" }
 */
router.get('/profile', isAuthenticated, authController.getProfile.bind(authController));

/**
 * Google OAuth Authentication
 * 
 * GET /api/auth/google
 * 
 * Initiates Google OAuth authentication flow.
 * Redirects to Google's authentication page.
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * Google OAuth Callback
 * 
 * GET /api/auth/google/callback
 * 
 * Handles the callback from Google after user authentication.
 * On success, redirects to /api/auth/success with a JWT token.
 * On failure, redirects to /api/auth/failure.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  authController.googleCallback.bind(authController)
);

/**
 * Authentication Success/Failure Handlers
 * 
 * These routes handle the redirects from OAuth authentication.
 * Success route returns the JWT token in the response.
 */
router.get('/success', authController.authSuccess.bind(authController));
router.get('/failure', authController.authFailure.bind(authController));

export default router; 