import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import UserModel from '../models/user.model';
import { IUser, IUserRegistration, IUserLogin, IJwtPayload } from '../interfaces/user.interface';

// Authentication service class
class AuthService {
  // Register a new user
  public async register(userData: IUserRegistration): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = await UserModel.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  public async login(loginData: IUserLogin): Promise<{ user: IUser; token: string }> {
    try {
      // Find user by email
      const user = await UserModel.findOne({ email: loginData.email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(loginData.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // Generate JWT token
  public generateToken(user: IUser): string {
    const payload: IJwtPayload = {
      id: user._id?.toString() || user.id,
      email: user.email,
      role: user.role,
    };

    // Using type assertion to handle the jwt.sign typing issue
    return jwt.sign(
      payload,
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
  }

  // Get user profile
  public async getProfile(userId: string): Promise<IUser> {
    try {
      const user = await UserModel.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(); 