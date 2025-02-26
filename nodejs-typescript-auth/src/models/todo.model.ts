import mongoose, { Schema } from 'mongoose';
import { ITodo } from '../interfaces/todo.interface';

// Todo schema definition
const TodoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Todo model
const TodoModel = mongoose.model<ITodo>('Todo', TodoSchema);
export default TodoModel; 