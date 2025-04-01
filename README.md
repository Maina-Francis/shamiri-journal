# Shamiri Journal App

A modern journaling application with mood tracking and analysis.

## Project Structure

This project is structured in two main directories:

- `frontend/`: Contains the React application built with Vite, TypeScript, and Tailwind CSS
- `backend/`: Contains the Node.js/Express API with Prisma ORM

Each directory is a self-contained application with its own package.json, dependencies, and scripts.

## Getting Started

To run the application, you need to start both the frontend and backend servers in separate terminal windows.

### Running the Backend

```bash
cd backend
npm install
npm run dev
```

The backend server will start at http://localhost:5000 (or your configured port).

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be available at http://localhost:5173 (or the next available port if 5173 is in use).

## Features

- Personal journaling with rich text editor
- Mood tracking and analysis
- Insights based on journal entries
- User authentication
- Mobile-responsive design

## Technologies

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- React Query
- ShadCN UI components

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication 