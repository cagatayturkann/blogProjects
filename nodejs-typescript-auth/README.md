# TypeScript Node.js Authentication API with Todo Functionality

A RESTful API built with TypeScript, Node.js, Express, and MongoDB that provides authentication (JWT and Google OAuth) and Todo management functionality.

## Features

- **TypeScript** - Strongly typed JavaScript
- **Authentication**
  - JWT-based authentication
  - Google OAuth integration
  - Password hashing with bcrypt
- **Todo Management**
  - Create, read, update, delete (CRUD) operations
  - Mark todos as complete/incomplete
- **MongoDB** - NoSQL database integration
- **Express** - Fast, unopinionated web framework
- **Passport.js** - Authentication middleware

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Google Developer Account (for OAuth)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nodejs-typescript-auth
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Todos

- `GET /api/todos` - Get all todos (protected)
- `GET /api/todos/:id` - Get a specific todo (protected)
- `POST /api/todos` - Create a new todo (protected)
- `PUT /api/todos/:id` - Update a todo (protected)
- `DELETE /api/todos/:id` - Delete a todo (protected)
- `PATCH /api/todos/:id/toggle` - Toggle todo completion status (protected)

## TypeScript Features Demonstrated

- **Basic Types** - String, number, boolean, etc.
- **Functions** - Arrow functions, function types, and return types
- **Object Types** - Interface-based object typing
- **Interfaces** - For defining contracts and shapes of objects
- **Classes** - OOP with TypeScript
- **Generics** - For reusable, type-safe components
- **Type Narrowing** - Runtime type checking
- **TypeScript Compiler** - Configuration and usage

## Project Structure

```
nodejs-typescript-auth/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── interfaces/     # TypeScript interfaces
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## License

MIT 