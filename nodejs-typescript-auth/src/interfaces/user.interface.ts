import { Document } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  googleId?: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for user registration data
export interface IUserRegistration {
  email: string;
  password: string;
  name: string;
}

// Interface for user login data
export interface IUserLogin {
  email: string;
  password: string;
}

// Interface for JWT payload
export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
} 