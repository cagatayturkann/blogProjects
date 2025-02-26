# Building a TypeScript Node.js Authentication API with Todo Functionality: A Complete Guide

In this tutorial, we'll build a full-featured REST API using TypeScript, Node.js, Express, and MongoDB. We'll implement both JWT and Google OAuth authentication, along with a complete Todo management system. This tutorial will cover various TypeScript features and best practices for building secure and scalable APIs.

## Table of Contents

1. [Project Setup](#project-setup)
2. [TypeScript Configuration](#typescript-configuration)
3. [Project Structure](#project-structure)
4. [Implementing Core Features](#implementing-core-features)
5. [Authentication System](#authentication-system)
6. [Todo Management](#todo-management)
7. [Testing the API](#testing-the-api)

## Project Setup

First, let's set up our project with TypeScript and necessary dependencies:

```bash
mkdir nodejs-typescript-auth
cd nodejs-typescript-auth
npm init -y
npm install typescript ts-node @types/node --save-dev
```

Install the required dependencies:

```bash
npm install express mongoose dotenv jsonwebtoken bcrypt passport passport-google-oauth20 passport-jwt cors
npm install @types/express @types/mongoose @types/jsonwebtoken @types/bcrypt @types/passport @types/passport-google-oauth20 @types/passport-jwt @types/cors --save-dev
```

## TypeScript Configuration

Create a `tsconfig.json` file with the following configuration:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Project Structure

Our project follows a clean and modular structure:

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── interfaces/     # TypeScript interfaces
├── middleware/     # Express middleware
├── models/        # Mongoose models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Utility functions
└── index.ts       # Application entry point
```

## Implementing Core Features

### 1. TypeScript Interfaces

Let's start by defining our interfaces. This demonstrates TypeScript's type system and interface capabilities:

```typescript
// src/interfaces/user.interface.ts
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  googleId?: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// src/interfaces/todo.interface.ts
export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: string;
}
```

### 2. MongoDB Models

We use TypeScript classes and decorators with Mongoose:

```typescript
// src/models/user.model.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Pre-save hook example using TypeScript
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});
```

## Authentication System

### 1. JWT Authentication

We implement JWT authentication using TypeScript generics and async/await:

```typescript
// src/services/auth.service.ts
class AuthService {
  public async login(loginData: IUserLogin): Promise<{ user: IUser; token: string }> {
    const user = await UserModel.findOne({ email: loginData.email });
    if (!user || !(await user.comparePassword(loginData.password))) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      token: this.generateToken(user)
    };
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );
  }
}
```

### 2. Google OAuth Integration

We use Passport.js with TypeScript for Google OAuth:

```typescript
// src/config/passport.ts
export const configurePassport = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ googleId: profile.id });
          if (!user) {
            user = await UserModel.create({
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
              name: profile.displayName
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
```

## Todo Management

### 1. Todo Service Layer

The service layer demonstrates TypeScript's type narrowing and error handling:

```typescript
// src/services/todo.service.ts
class TodoService {
  public async createTodo(todoData: ICreateTodo, userId: string): Promise<ITodo> {
    try {
      const todo = await TodoModel.create({
        ...todoData,
        user: userId
      });
      return todo;
    } catch (error) {
      throw new Error('Failed to create todo');
    }
  }

  public async updateTodo(
    todoId: string,
    todoData: IUpdateTodo,
    userId: string
  ): Promise<ITodo> {
    const todo = await TodoModel.findOneAndUpdate(
      { _id: todoId, user: userId },
      todoData,
      { new: true }
    );
    
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    return todo;
  }
}
```

### 2. Controller Layer

Controllers showcase TypeScript's async/await and error handling patterns:

```typescript
// src/controllers/todo.controller.ts
class TodoController {
  public async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const todos = await todoService.getAllTodos(userId);
      
      res.status(200).json({
        success: true,
        data: todos
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
```

## Testing the API

You can test the API using tools like Postman or curl. Here are some example requests:

### Authentication

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Todo Operations

```bash
# Create a todo (with JWT token)
curl -X POST http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn TypeScript","description":"Study TypeScript features"}'
```

## Conclusion

This tutorial demonstrated how to build a secure and scalable API using TypeScript and Node.js. We covered important TypeScript features like:

- Interfaces and type definitions
- Generics with API responses
- Class-based services
- Type narrowing and error handling
- Async/await with proper typing
- MongoDB integration with TypeScript

The complete source code is available in the repository, along with detailed documentation for each component.

Remember to:
1. Set up proper environment variables
2. Configure MongoDB connection
3. Set up Google OAuth credentials
4. Follow security best practices in production

Happy coding! 