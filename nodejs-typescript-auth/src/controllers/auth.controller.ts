import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { IApiResponse } from '../interfaces/todo.interface';
import { IUser } from '../interfaces/user.interface';

/**
 * Authentication Controller
 * 
 * This class handles all authentication-related HTTP requests.
 * It provides methods for user registration, login, profile retrieval,
 * and OAuth authentication flows.
 */
class AuthController {
  /**
   * Register a new user
   * 
   * This method handles user registration by:
   * 1. Creating a new user in the database
   * 2. Generating a JWT token for the new user
   * 3. Returning the user data and token
   * 
   * @param req - Express request object containing user registration data
   * @param res - Express response object
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      // Create a new user using the auth service
      const user = await authService.register(req.body);
      
      // Generate JWT token for the new user
      const token = authService.generateToken(user);
      
      // Remove password from response for security
      const userResponse = user.toObject();
      delete userResponse.password;
      
      // Prepare success response with user data and token
      const response: IApiResponse<{ user: Partial<IUser>; token: string }> = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token,
        },
      };
      
      // Send 201 Created response
      res.status(201).json(response);
    } catch (error: any) {
      // Handle registration errors
      const response: IApiResponse<null> = {
        success: false,
        message: 'Registration failed',
        error: error.message,
      };
      
      // Send 400 Bad Request response
      res.status(400).json(response);
    }
  }

  /**
   * Login user
   * 
   * This method authenticates a user by:
   * 1. Verifying email and password
   * 2. Generating a JWT token
   * 3. Returning the user data and token
   * 
   * @param req - Express request object containing login credentials
   * @param res - Express response object
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      // Authenticate user and get token
      const { user, token } = await authService.login(req.body);
      
      // Remove password from response for security
      const userResponse = user.toObject();
      delete userResponse.password;
      
      // Prepare success response with user data and token
      const response: IApiResponse<{ user: Partial<IUser>; token: string }> = {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token,
        },
      };
      
      // Send 200 OK response
      res.status(200).json(response);
    } catch (error: any) {
      // Handle login errors
      const response: IApiResponse<null> = {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
      
      // Send 401 Unauthorized response
      res.status(401).json(response);
    }
  }

  /**
   * Get user profile
   * 
   * This method retrieves the authenticated user's profile.
   * The user must be authenticated to access this endpoint.
   * 
   * @param req - Express request object with authenticated user
   * @param res - Express response object
   */
  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User is already attached to request by auth middleware
      if (!req.user) {
        throw new Error('User not found');
      }
      
      const user = req.user;
      
      // Prepare success response with user data
      const response: IApiResponse<IUser> = {
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
      };
      
      // Send 200 OK response
      res.status(200).json(response);
    } catch (error: any) {
      // Handle profile retrieval errors
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve profile',
        error: error.message,
      };
      
      // Send 500 Internal Server Error response
      res.status(500).json(response);
    }
  }

  /**
   * Google OAuth callback
   * 
   * This method handles the callback from Google OAuth authentication.
   * It generates a JWT token for the authenticated user and redirects
   * to the success endpoint with the token.
   * 
   * @param req - Express request object with authenticated user from Google
   * @param res - Express response object
   */
  public async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      // User is attached to request by passport
      if (!req.user) {
        throw new Error('Authentication failed');
      }
      
      // Generate JWT token for the authenticated user
      const token = authService.generateToken(req.user);
      
      // Redirect to frontend with token
      // In a real app, you might want to redirect to a frontend URL with the token
      res.redirect(`/api/auth/success?token=${token}`);
    } catch (error: any) {
      // Redirect to failure endpoint on error
      res.redirect('/api/auth/failure');
    }
  }

  /**
   * Auth success handler
   * 
   * This method handles successful authentication redirects.
   * It returns the JWT token that was passed in the query string.
   * 
   * @param req - Express request object with token in query
   * @param res - Express response object
   */
  public authSuccess(req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token: req.query.token,
    });
  }

  /**
   * Auth failure handler
   * 
   * This method handles failed authentication redirects.
   * 
   * @param req - Express request object
   * @param res - Express response object
   */
  public authFailure(req: Request, res: Response): void {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
}

export default new AuthController(); 