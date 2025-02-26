import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../interfaces/user.interface';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: IUser;
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: IUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Please login to access this resource',
      });
    }

    // Set user in request object
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // First check if user is authenticated
  isAuthenticated(req, res, () => {
    // Check if user has admin role
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Forbidden - Admin access required',
      });
    }
  });
}; 