import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../interfaces/user.interface';

/**
 * Type Declaration for Express
 * 
 * This extends the Express namespace to include our custom user type.
 * It ensures TypeScript recognizes the user object attached to requests.
 */
declare global {
  namespace Express {
    // Extend the User interface to include our custom IUser properties
    interface User extends IUser {}
    // Explicitly define the user property on the Request interface
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Authentication Middleware
 * 
 * This middleware verifies if the user is authenticated using JWT strategy.
 * It extracts the JWT token from the Authorization header and validates it.
 * If valid, it attaches the user object to the request for use in route handlers.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  // Use passport's JWT strategy to authenticate the request
  passport.authenticate('jwt', { session: false }, (err: Error, user: IUser) => {
    // Handle authentication errors
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message,
      });
    }

    // If no user was found or token is invalid
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Please login to access this resource',
      });
    }

    // Attach the authenticated user to the request object
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  })(req, res, next);
};

/**
 * Admin Authorization Middleware
 * 
 * This middleware checks if the authenticated user has admin role.
 * It first verifies that the user is authenticated, then checks the role.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // First check if user is authenticated
  isAuthenticated(req, res, () => {
    // Check if user has admin role
    if (req.user && req.user.role === 'admin') {
      // User is an admin, proceed to the next middleware or route handler
      next();
    } else {
      // User is not an admin, return forbidden error
      res.status(403).json({
        success: false,
        message: 'Forbidden - Admin access required',
      });
    }
  });
}; 