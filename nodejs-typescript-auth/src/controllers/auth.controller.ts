import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { IApiResponse } from '../interfaces/todo.interface';
import { IUser } from '../interfaces/user.interface';

// Authentication controller class
class AuthController {
  // Register a new user
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.register(req.body);
      
      // Generate token for the new user
      const token = authService.generateToken(user);
      
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      
      const response: IApiResponse<{ user: Partial<IUser>; token: string }> = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token,
        },
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Registration failed',
        error: error.message,
      };
      
      res.status(400).json(response);
    }
  }

  // Login user
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await authService.login(req.body);
      
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      
      const response: IApiResponse<{ user: Partial<IUser>; token: string }> = {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token,
        },
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
      
      res.status(401).json(response);
    }
  }

  // Get user profile
  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User is already attached to request by auth middleware
      if (!req.user) {
        throw new Error('User not found');
      }
      
      const user = req.user;
      
      const response: IApiResponse<IUser> = {
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve profile',
        error: error.message,
      };
      
      res.status(500).json(response);
    }
  }

  // Google OAuth callback
  public async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      // User is attached to request by passport
      if (!req.user) {
        throw new Error('Authentication failed');
      }
      
      // Generate token
      const token = authService.generateToken(req.user);
      
      // Redirect to frontend with token
      // In a real app, you might want to redirect to a frontend URL with the token
      res.redirect(`/api/auth/success?token=${token}`);
    } catch (error: any) {
      res.redirect('/api/auth/failure');
    }
  }

  // Auth success handler
  public authSuccess(req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token: req.query.token,
    });
  }

  // Auth failure handler
  public authFailure(req: Request, res: Response): void {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
}

export default new AuthController(); 