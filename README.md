# TaskNest - Task Management System

## Overview

This Task Management System is a comprehensive solution for organizing daily tasks and responsibilities. It provides an intuitive interface for creating, updating, and tracking tasks with features like priority levels, due dates, categories, and real-time statistics.

- **Live Frontend:** https://tasknest-kjyy.onrender.com
- **Backend API:** https://tasknest-k8mb.onrender.com
- **API Documentation:** https://tasknest-k8mb.onrender.com/api-docs

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Context API
- **Backend:** Node.js, Express.js, Swagger UI
- **Database:** MongoDB, Mongoose

## Setup Instructions

### Backend

1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file with `MONGODB_URI`, `JWT_SECRET`, and `PORT`.
4. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API endpoints:
   Create a `.env` file or update `src/utils/api.js` with:
   ```
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Features Implemented

- **User Authentication:** Secure registration and login using JWT and bcrypt.
- **Task Management:** Full CRUD operations for tasks with priorities, status, and categories.
- **Team Collaboration:** Create teams, invite members via email, and assign tasks.
- **Dashboard & Analytics:** Real-time visualization of task statistics and progress.
- **Search & Filtering:** Advanced filtering and sorting by status, priority, and category.
- **Responsive Design:** Fully responsive UI built with Tailwind CSS.

## Challenges and Solutions

1. **Challenge: Complex State Management**
   Managing the state for both personal tasks and team-based tasks within the same dashboard was complex.
   **Solution:** I implemented a dual-view architecture using React Context for global authentication state and localized state management for the Dashboard and Team views to ensure smooth transitions and data integrity.

2. **Challenge: Secure Team Invitations**
   Creating a secure way to invite users to teams without exposing sensitive data.
   **Solution:** Developed a token-based invitation system where unique, time-limited tokens are generated and sent via email. These tokens are validated on the backend before granting team membership.
