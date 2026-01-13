#  TaskNest


## Overview

This Task Management System is a comprehensive solution for organizing daily tasks and responsibilities. It provides an intuitive interface for creating, updating, and tracking tasks with features like priority levels, due dates, categories, and real-time statistics.

**Live Demo:** [Your Deployed App URL]


## Features

### Core Features
-  **User Authentication**
  - Secure registration and login with JWT
  - Password hashing with bcrypt
  - Protected routes and API endpoints
  - Persistent authentication with local storage

-  **Task Management**
  - Create, read, update, and delete tasks (Full CRUD)
  - Task properties: title, description, category, priority, status, due date
  - Status tracking: Pending, In Progress, Completed
  - Priority levels: Low, Medium, High
  - Custom categories/tags

- **Dashboard & Analytics**
  - Real-time task statistics
  - Visual cards showing total, completed, in-progress, and overdue tasks
  - Category and priority breakdowns
  - Completion rate calculation

- **Advanced Features**
  - **Search Functionality**: Search tasks by title, description, or category
  - **Multi-filter Support**: Filter by status, priority, and category
  - **Pagination**: Efficient handling of large task lists
  - **Overdue Detection**: Automatic detection and highlighting of overdue tasks
  - **Responsive Design**: Mobile-first, works seamlessly on all devices
  - **Loading States**: Smooth user experience with loading indicators
  - **Error Handling**: Comprehensive error messages and validation

##  Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Security & Utilities
- **JWT (jsonwebtoken)** - Secure authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Express Validator** - Request validation

### Development Tools
- **Nodemon** - Auto-restart development server
- **Swagger UI** - API documentation
- **ESLint** - Code linting
- **Prettier** - Code formatting

##  Project Structure

```
taskNest/
├── backend/
│   ├── config/
│   │   └── swagger.js          # Swagger API documentation
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   └── taskController.js   # Task CRUD operations
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── errorHandler.js     # Error handling
│   │   └── validation.js       # Request validation
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Task.js             # Task schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   └── tasks.js            # Task routes
│   ├── .env                    # Environment variables
│   ├── .env.example            # Example env file
│   ├── server.js               # Entry point
│   └── package.json            # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── contexts/           # Context providers
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   └── package.json            # Dependencies
│
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
 

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

6. **Access API Documentation**
   Open `http://localhost:5000/api-docs` in your browser

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update the `API_URL` in `src/App.jsx` or create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
 






