import { Router } from 'express';
import todoController from '../controllers/todo.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

// All todo routes are protected and require authentication
router.use(isAuthenticated);

// Get all todos
router.get('/', todoController.getAllTodos.bind(todoController));

// Get a single todo by ID
router.get('/:id', todoController.getTodoById.bind(todoController));

// Create a new todo
router.post('/', todoController.createTodo.bind(todoController));

// Update a todo
router.put('/:id', todoController.updateTodo.bind(todoController));

// Delete a todo
router.delete('/:id', todoController.deleteTodo.bind(todoController));

// Toggle todo completion status
router.patch('/:id/toggle', todoController.toggleTodoStatus.bind(todoController));

export default router; 