import { Document } from 'mongoose';

/**
 * Todo Document Interface
 * 
 * This interface extends Mongoose's Document interface and defines
 * the structure of a todo document in the database.
 * 
 * It includes all todo properties that will be available
 * on todo documents retrieved from MongoDB.
 */
export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: string; // Reference to user ID
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Todo Interface
 * 
 * This interface defines the data structure required
 * when creating a new todo.
 * 
 * Note that we don't include fields that will be
 * automatically set by the server (user, completed, dates).
 */
export interface ICreateTodo {
  title: string;
  description?: string;
}

/**
 * Update Todo Interface
 * 
 * This interface defines the data structure for
 * updating an existing todo.
 * 
 * All fields are optional since updates may modify
 * only a subset of the todo's properties.
 */
export interface IUpdateTodo {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * API Response Interface
 * 
 * This is a generic interface for standardizing API responses.
 * It provides a consistent structure for all API endpoints:
 * - success: boolean indicating if the operation succeeded
 * - message: human-readable message about the operation
 * - data: optional payload of the response (generic type T)
 * - error: optional error message if operation failed
 * 
 * @template T - The type of data returned in the response
 */
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
} 