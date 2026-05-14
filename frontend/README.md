# Todo App Frontend

A React-based todo application with user authentication and task management.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Features

- User Registration and Login
- Create, Edit, Delete Tasks
- Mark tasks as completed
- Responsive design with Bootstrap

## Demo Mode

The app includes offline/demo mode functionality:
- If the backend server is not running, the app will work in demo mode
- You can register and login with any credentials in demo mode
- All task operations work locally in demo mode

## Usage

1. **Register**: Create a new account with name, email, and password
2. **Login**: Use your credentials to login (or any credentials in demo mode)
3. **Create Tasks**: Add new tasks with name and description
4. **Manage Tasks**: Edit, complete, or delete existing tasks

## Backend

This frontend is designed to work with a Node.js/Express backend running on `http://localhost:8000`.
If the backend is not available, the app automatically switches to demo mode.