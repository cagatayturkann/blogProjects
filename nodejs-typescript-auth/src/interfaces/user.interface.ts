import { Document } from 'mongoose';

/**
 * TypeScript Interface Naming Convention
 * 
 * In this project, interfaces are prefixed with "I" (e.g., IUser, ITodo).
 * This is a common convention in TypeScript, especially in projects with
 * C# or .NET influence. It helps to quickly identify interfaces in the code.
 * 
 * While not required by TypeScript itself, this convention improves code
 * readability and makes it clear when a type is an interface.
 */

/**
 * User Document Interface
 * 
 * This interface extends Mongoose's Document interface and defines
 * the structure of a user document in the database.
 * 
 * It includes all user properties and methods that will be available
 * on user documents retrieved from MongoDB.
 */
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

/**
 * User Registration Interface
 * 
 * This interface defines the data structure required
 * when registering a new user.
 */
export interface IUserRegistration {
  email: string;
  password: string;
  name: string;
}

/**
 * User Login Interface
 * 
 * This interface defines the data structure required
 * when a user attempts to log in.
 */
export interface IUserLogin {
  email: string;
  password: string;
}

/**
 * JWT Payload Interface
 * 
 * This interface defines the structure of the data
 * that will be encoded in the JWT token.
 */
export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
} 