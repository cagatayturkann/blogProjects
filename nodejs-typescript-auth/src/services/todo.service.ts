import TodoModel from '../models/todo.model';
import { ITodo, ICreateTodo, IUpdateTodo } from '../interfaces/todo.interface';

// Todo service class
class TodoService {
  // Get all todos for a user
  public async getAllTodos(userId: string): Promise<ITodo[]> {
    try {
      const todos = await TodoModel.find({ user: userId }).sort({ createdAt: -1 });
      return todos;
    } catch (error) {
      throw error;
    }
  }

  // Get a single todo by ID
  public async getTodoById(todoId: string, userId: string): Promise<ITodo> {
    try {
      const todo = await TodoModel.findOne({ _id: todoId, user: userId });
      if (!todo) {
        throw new Error('Todo not found');
      }
      return todo;
    } catch (error) {
      throw error;
    }
  }

  // Create a new todo
  public async createTodo(todoData: ICreateTodo, userId: string): Promise<ITodo> {
    try {
      const todo = await TodoModel.create({
        ...todoData,
        user: userId,
      });
      return todo;
    } catch (error) {
      throw error;
    }
  }

  // Update a todo
  public async updateTodo(
    todoId: string,
    todoData: IUpdateTodo,
    userId: string
  ): Promise<ITodo> {
    try {
      const todo = await TodoModel.findOneAndUpdate(
        { _id: todoId, user: userId },
        todoData,
        { new: true }
      );
      
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      return todo;
    } catch (error) {
      throw error;
    }
  }

  // Delete a todo
  public async deleteTodo(todoId: string, userId: string): Promise<boolean> {
    try {
      const result = await TodoModel.deleteOne({ _id: todoId, user: userId });
      
      if (result.deletedCount === 0) {
        throw new Error('Todo not found');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Toggle todo completion status
  public async toggleTodoStatus(todoId: string, userId: string): Promise<ITodo> {
    try {
      // First get the todo to check its current status
      const todo = await this.getTodoById(todoId, userId);
      
      // Toggle the completed status
      return await this.updateTodo(
        todoId,
        { completed: !todo.completed },
        userId
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new TodoService(); 