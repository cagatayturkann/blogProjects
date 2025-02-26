import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

// Register a new user
router.post('/register', authController.register.bind(authController));

// Login user
router.post('/login', authController.login.bind(authController));

// Get user profile (protected route)
router.get('/profile', isAuthenticated, authController.getProfile.bind(authController));

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  authController.googleCallback.bind(authController)
);

// Auth success/failure routes
router.get('/success', authController.authSuccess.bind(authController));
router.get('/failure', authController.authFailure.bind(authController));

export default router; 