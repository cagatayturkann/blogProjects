import { Request, Response } from 'express';
import todoService from '../services/todo.service';
import { IApiResponse } from '../interfaces/todo.interface';
import { IUser } from '../interfaces/user.interface';
import mongoose from 'mongoose';

// Todo controller class
class TodoController {
  // Get all todos for the authenticated user
  public async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from authenticated user
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      const userId = req.user._id.toString();
      
      const todos = await todoService.getAllTodos(userId);
      
      const response: IApiResponse<typeof todos> = {
        success: true,
        message: 'Todos retrieved successfully',
        data: todos,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve todos',
        error: error.message,
      };
      
      res.status(500).json(response);
    }
  }

  // Get a single todo by ID
  public async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      const userId = req.user._id.toString();
      
      const todo = await todoService.getTodoById(id, userId);
      
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: 'Todo retrieved successfully',
        data: todo,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve todo',
        error: error.message,
      };
      
      // If todo not found, return 404
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        res.status(500).json(response);
      }
    }
  }

  // Create a new todo
  public async createTodo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      const userId = req.user._id.toString();
      
      const todo = await todoService.createTodo(req.body, userId);
      
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: 'Todo created successfully',
        data: todo,
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to create todo',
        error: error.message,
      };
      
      res.status(400).json(response);
    }
  }

  // Update a todo
  public async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      const userId = req.user._id.toString();
      
      const todo = await todoService.updateTodo(id, req.body, userId);
      
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: 'Todo updated successfully',
        data: todo,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to update todo',
        error: error.message,
      };
      
      // If todo not found, return 404
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        res.status(400).json(response);
      }
    }
  }

  // Delete a todo
  public async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      const userId = req.user._id.toString();
      
      await todoService.deleteTodo(id, userId);
      
      const response: IApiResponse<null> = {
        success: true,
        message: 'Todo deleted successfully',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to delete todo',
        error: error.message,
      };
      
      // If todo not found, return 404
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        res.status(500).json(response);
      }
    }
  }

  // Toggle todo completion status
  public async toggleTodoStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!req.user || !req.user._id) {
        throw new Error('User ID not found');
      }
      
      const userId = req.user._id.toString();
      
      const todo = await todoService.toggleTodoStatus(id, userId);
      
      const response: IApiResponse<typeof todo> = {
        success: true,
        message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
        data: todo,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: IApiResponse<null> = {
        success: false,
        message: 'Failed to update todo status',
        error: error.message,
      };
      
      // If todo not found, return 404
      if (error.message === 'Todo not found') {
        res.status(404).json(response);
      } else {
        res.status(500).json(response);
      }
    }
  }
}

export default new TodoController(); 