import { Router } from 'express';
import todoController from '../controllers/todo.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

/**
 * Todo Routes
 * 
 * This file defines all routes related to todo management.
 * All routes are protected and require authentication.
 * Each route ensures that users can only access their own todos.
 */

const router = Router();

/**
 * Middleware Configuration
 * 
 * Apply the isAuthenticated middleware to all todo routes.
 * This ensures that only authenticated users can access these endpoints.
 */
router.use(isAuthenticated);

/**
 * Get All Todos
 * 
 * GET /api/todos
 * 
 * Retrieves all todos belonging to the authenticated user.
 * 
 * Headers: { Authorization: "Bearer [token]" }
 */
router.get('/', todoController.getAllTodos.bind(todoController));

/**
 * Get Todo by ID
 * 
 * GET /api/todos/:id
 * 
 * Retrieves a specific todo by its ID.
 * Only returns the todo if it belongs to the authenticated user.
 * 
 * Headers: { Authorization: "Bearer [token]" }
 * URL Params: id - The ID of the todo to retrieve
 */
router.get('/:id', todoController.getTodoById.bind(todoController));

/**
 * Create Todo
 * 
 * POST /api/todos
 * 
 * Creates a new todo for the authenticated user.
 * 
 * Headers: { Authorization: "Bearer [token]" }
 * Request Body: { title, description? }
 */
router.post('/', todoController.createTodo.bind(todoController));

/**
 * Update Todo
 * 
 * PUT /api/todos/:id
 * 
 * Updates an existing todo.
 * Only updates the todo if it belongs to the authenticated user.
 * 
 * Headers: { Authorization: "Bearer [token]" }
 * URL Params: id - The ID of the todo to update
 * Request Body: { title?, description?, completed? }
 */
router.put('/:id', todoController.updateTodo.bind(todoController));

/**
 * Delete Todo
 * 
 * DELETE /api/todos/:id
 * 
 * Deletes a specific todo.
 * Only deletes the todo if it belongs to the authenticated user.
 * 
 * Headers: { Authorization: "Bearer [token]" }
 * URL Params: id - The ID of the todo to delete
 */
router.delete('/:id', todoController.deleteTodo.bind(todoController));

/**
 * Toggle Todo Status
 * 
 * PATCH /api/todos/:id/toggle
 * 
 * Toggles the completion status of a todo.
 * Only toggles the todo if it belongs to the authenticated user.
 * 
 * Headers: { Authorization: "Bearer [token]" }
 * URL Params: id - The ID of the todo to toggle
 */
router.patch('/:id/toggle', todoController.toggleTodoStatus.bind(todoController));

export default router; 