# Shamiri Journal App

A modern journaling application with mood tracking, AI analysis, and personal insights.

## Live Demo

**Try the app here with full AI capabilities:** [https://shamiri-journal-frontend.onrender.com/](https://shamiri-journal-frontend.onrender.com)

> **Note:** The application is deployed on Render's free tier, which puts services to sleep after 15 minutes of inactivity. The first load may take 1-2 minutes while the server spins up. Subsequent interactions will be much faster.

## Overview

Shamiri Journal is a full-stack web application designed to help users track their thoughts, feelings, and daily experiences through journaling. The app leverages AI to provide personalized insights, mood analysis, and topic tracking to help users gain a deeper understanding of their emotional patterns and well-being.

![Image](https://github.com/user-attachments/assets/956cb0da-75ca-4a9b-80c1-7b911817a01b)

## Project Structure

This project is structured in two main directories:

- **`frontend/`**: Contains the React application built with Vite, TypeScript, and Tailwind CSS.
- **`backend/`**: Contains the Node.js/Express API with Prisma ORM.

Each directory is a self-contained application with its own `package.json`, dependencies, and scripts.

## Features

### **User Authentication**
- Secure signup and login functionality.
- JWT-based authentication system.
- Password hashing and security.
- Protected routes for authenticated users.

### **Journal Management**
- Create, read, update, and delete journal entries.
- Rich text editor for expressive writing.
- Mood tracking with each entry.
- Favorite/bookmark important entries.
- Calendar view to track journaling history.
- Search and filter functionality.
- Categorization and tagging system.

### **AI-Powered Insights**
- Mood pattern analysis over time.
- Topic identification and tracking.
- Personal growth recommendations.
- Emotional trend visualization.
- AI-generated reflections on journaling patterns.

### **Dashboard**
- Overview of journaling statistics.
- Recent activity tracking.
- Writing streak monitoring.
- Quick access to favorite entries.
- Visualization of mood distribution.

### **UI/UX**
- Responsive design for all devices.
- Intuitive and clean user interface.
- Light/dark mode compatibility.
- Interactive charts and graphs.
- Animated transitions and components.

## Technologies

### **Frontend**
- React 18+ with TypeScript.
- Vite for fast development and building.
- Tailwind CSS for styling.
- React Query for data fetching and caching.
- ShadCN UI components.
- React Router for navigation.
- Context API for state management.
- Chart.js for data visualization.
- Lucide icons.

### **Backend**
- Node.js.
- Express framework.
- TypeScript.
- Prisma ORM.
- PostgreSQL database.
- JSON Web Token (JWT) for authentication.
- BCrypt for password hashing.
- Claude AI integration for insights.

## Getting Started

### **Prerequisites**
- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### **Environment Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shamiri-journal.git
   cd shamiri-journal
   ```

2. Set up environment variables:
   Create a `.env` file in the backend directory:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL="postgresql://user:password@localhost:5432/shamiri_journal?schema=public"

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_REFRESH_EXPIRES_IN=30d 

   # AI Integration
   CLAUDE_KEY=your_claude_api_key_here
   ```

### **Running the Backend**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```
The backend server will start at http://localhost:5000 (or your configured port).

### **Running the Frontend**
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be available at http://localhost:5173 (or the next available port if 5173 is in use).

## API Documentation

The API is fully documented using Swagger/OpenAPI specification. You can access the interactive API documentation in two ways:

### Swagger UI Documentation
When running the backend server locally, visit:
```
http://localhost:5000/api-docs
```

This provides an interactive interface where you can:
- Browse all available endpoints
- Test API endpoints directly from the browser
- View request/response schemas
- See authentication requirements
- Try out endpoints with your own data

### OpenAPI Specification
Raw OpenAPI specification is available at:
```
http://localhost:5000/api-docs.json
```

### Authentication
Most endpoints require authentication using JWT tokens. To authenticate:
1. Get a token by registering (`POST /api/auth/register`) or logging in (`POST /api/auth/login`)
2. Include the token in the Authorization header:
```
Authorization: Bearer your-token-here
```

### Available Endpoints

#### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user information (authenticated)
- `POST /api/auth/change-password` - Change user password (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

#### Journal Endpoints (all authenticated)
- `GET /api/journals` - Get all journals (with pagination, search, filter)
- `GET /api/journals/:id` - Get a specific journal entry
- `POST /api/journals` - Create a new journal entry
- `PUT /api/journals/:id` - Update a journal entry
- `DELETE /api/journals/:id` - Delete a journal entry
- `PATCH /api/journals/:id/favorite` - Toggle favorite status
- `GET /api/journals/stats` - Get journal statistics and AI insights
- `GET /api/journals/all` - Get all journal entries for insights

## AI Integration

Shamiri Journal uses the Claude AI model to analyze journal entries and provide personalized insights. The application processes the following:

- Mood tracking and emotional patterns.
- Recurring topics and themes in entries.
- Writing patterns and frequency.
- Personalized recommendations for well-being.

The AI insights help users gain a deeper understanding of their emotional states and journaling habits over time.

## Features Walkthrough

### Home Page
The landing page introduces the application, its features, and benefits. Users can sign up or log in from here.

### Dashboard
After logging in, users are directed to the Dashboard, which provides an overview of their journaling activity, including:

✅ Total entries count.  
✅ Favorite entries count.  
✅ Writing streak statistics.  
✅ Recent activity graph.  
✅ Quick access to favorite entries.  

### Journal Page
The main journaling interface where users can:

- View a calendar of their entries.
- Create new entries with the rich text editor.
- Select a mood for each entry.
- See their recent and favorite entries.
- Track their writing streak.

### Insights Page
The AI-powered analytics page that shows:

📊 Mood distribution in pie charts.  
📅 Journaling activity over time.  
🏷️ Topic analysis of entries.  
🤖 AI-generated reflections on journal patterns.  
📝 Personalized suggestions based on journaling habits.  

### Settings Page
Users can manage their account settings, preferences, and profile information.

## Mobile Responsiveness
Shamiri Journal is fully responsive and optimized for:

- Desktop/laptop screens.
- Tablets.
- Mobile phones.

The application uses a responsive design approach with tailored layouts for different screen sizes.

## Customization
Users can customize their experience through:

📌 Journal entry categorization.  
⭐ Favoriting important entries.  
🔍 Filtering and searching entries.  
📅 Calendar view navigation.  

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
