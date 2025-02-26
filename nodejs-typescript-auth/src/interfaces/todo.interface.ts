import { Document } from 'mongoose';

// Interface for Todo document
export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: string; // Reference to user ID
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new todo
export interface ICreateTodo {
  title: string;
  description?: string;
}

// Interface for updating a todo
export interface IUpdateTodo {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Generic interface for API responses
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
} 