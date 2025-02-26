import { Request, Response } from 'express';
import todoService from '../services/todo.service';
import { IApiResponse } from '../interfaces/todo.interface';
import { IUser } from '../interfaces/user.interface';
import mongoose from 'mongoose';

/**
 * Todo Controller
 * 
 * This class handles all todo-related HTTP requests.
 * It provides methods for creating, reading, updating, and deleting todos.
 * All methods require authentication and ensure that users can only
 * access their own todos.
 */
class TodoController {
  /**
   * Get all todos for the authenticated user
   * 
   * This method retrieves all todos belonging to the authenticated user.
   * 
   * @param req - Express request object with authenticated user
   * @param res - Express response object
   */
  public async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      // Verify user is authenticated and has an ID
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      // Get user ID from the authenticated user
      const userId = req.user._id.toString();
      
      // Retrieve all todos for this user from the service
      const todos = await todoService.getAllTodos(userId);
      
      // Prepare success response with todos data
      const response: IApiResponse<typeof todos> = {
        success: true,
        message: 'Todos retrieved successfully',
        data: todos,
      };
      
      // Send 200 OK response
      res.status(200).json(response);
    } catch (error: any) {
      // Handle errors retrieving todos
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve todos',
        error: error.message,
      };
      
      // Send 500 Internal Server Error response
      res.status(500).json(response);
    }
  }

  /**
   * Get a single todo by ID
   * 
   * This method retrieves a specific todo by its ID.
   * It ensures the todo belongs to the authenticated user.
   * 
   * @param req - Express request object with todo ID and authenticated user
   * @param res - Express response object
   */
  public async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      // Get todo ID from request parameters
      const { id } = req.params;
      
      // Verify user is authenticated and has an ID
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      // Get user ID from the authenticated user
      const userId = req.user._id.toString();
      
      // Retrieve the specific todo from the service
      const todo = await todoService.getTodoById(id, userId);
      
      // Prepare success response with todo data
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: 'Todo retrieved successfully',
        data: todo,
      };
      
      // Send 200 OK response
      res.status(200).json(response);
    } catch (error: any) {
      // Handle errors retrieving the todo
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve todo',
        error: error.message,
      };
      
      // If todo not found, return 404 Not Found
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        // Otherwise return 500 Internal Server Error
        res.status(500).json(response);
      }
    }
  }

  /**
   * Create a new todo
   * 
   * This method creates a new todo for the authenticated user.
   * 
   * @param req - Express request object with todo data and authenticated user
   * @param res - Express response object
   */
  public async createTodo(req: Request, res: Response): Promise<void> {
    try {
      // Verify user is authenticated and has an ID
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      // Get user ID from the authenticated user
      const userId = req.user._id.toString();
      
      // Create a new todo using the service
      const todo = await todoService.createTodo(req.body, userId);
      
      // Prepare success response with the created todo
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: 'Todo created successfully',
        data: todo,
      };
      
      // Send 201 Created response
      res.status(201).json(response);
    } catch (error: any) {
      // Handle errors creating the todo
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to create todo',
        error: error.message,
      };
      
      // Send 400 Bad Request response
      res.status(400).json(response);
    }
  }

  /**
   * Update a todo
   * 
   * This method updates an existing todo.
   * It ensures the todo belongs to the authenticated user.
   * 
   * @param req - Express request object with todo ID, update data, and authenticated user
   * @param res - Express response object
   */
  public async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      // Get todo ID from request parameters
      const { id } = req.params;
      
      // Verify user is authenticated and has an ID
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      // Get user ID from the authenticated user
      const userId = req.user._id.toString();
      
      // Update the todo using the service
      const todo = await todoService.updateTodo(id, req.body, userId);
      
      // Prepare success response with the updated todo
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: 'Todo updated successfully',
        data: todo,
      };
      
      // Send 200 OK response
      res.status(200).json(response);
    } catch (error: any) {
      // Handle errors updating the todo
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to update todo',
        error: error.message,
      };
      
      // If todo not found, return 404 Not Found
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        // Otherwise return 400 Bad Request
        res.status(400).json(response);
      }
    }
  }

  /**
   * Delete a todo
   * 
   * This method deletes a specific todo.
   * It ensures the todo belongs to the authenticated user.
   * 
   * @param req - Express request object with todo ID and authenticated user
   * @param res - Express response object
   */
  public async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      // Get todo ID from request parameters
      const { id } = req.params;
      
      // Verify user is authenticated and has an ID
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      // Get user ID from the authenticated user
      const userId = req.user._id.toString();
      
      // Delete the todo using the service
      await todoService.deleteTodo(id, userId);
      
      // Prepare success response
      const response: IApiResponse<null> = {
        success: true,
        message: 'Todo deleted successfully',
      };
      
      // Send 200 OK response
      res.status(200).json(response);
    } catch (error: any) {
      // Handle errors deleting the todo
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to delete todo',
        error: error.message,
      };
      
      // If todo not found, return 404 Not Found
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        // Otherwise return 500 Internal Server Error
        res.status(500).json(response);
      }
    }
  }

  /**
   * Toggle todo completion status
   * 
   * This method toggles the completion status of a todo.
   * It ensures the todo belongs to the authenticated user.
   * 
   * @param req - Express request object with todo ID and authenticated user
   * @param res - Express response object
   */
  public async toggleTodoStatus(req: Request, res: Response): Promise<void> {
    try {
      // Get todo ID from request parameters
      const { id } = req.params;
      
      // Verify user is authenticated and has an ID
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      // Get user ID from the authenticated user
      const userId = req.user._id.toString();
      
      // Toggle the todo status using the service
      const todo = await todoService.toggleTodoStatus(id, userId);
      
      // Prepare success response with the updated todo
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
        data: todo,
      };
      
      // Send 200 OK response
      res.status(200).json(response);
    } catch (error: any) {
      // Handle errors toggling the todo status
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to update todo status',
        error: error.message,
      };
      
      // If todo not found, return 404 Not Found
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        // Otherwise return 500 Internal Server Error
        res.status(500).json(response);
      }
    }
  }
}

export default new TodoController(); 