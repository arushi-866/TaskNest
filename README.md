# TaskNest - Task Management System

## Overview

This Task Management System is a comprehensive solution for organizing daily tasks and responsibilities. It provides an intuitive interface for creating, updating, and tracking tasks with features like priority levels, due dates, categories, and real-time statistics.

- **Live URL:**https://tasknest-kjyy.onrender.com 
## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Context API
- **Backend:** Node.js, Express.js, Swagger UI
- **Database:** MongoDB, Mongoose

## Project Structure

```
backend/
│
├── config/
│   └── swagger.js
│
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   ├── teamController.js
│   └── teams.js
│
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
│
├── models/
│   ├── Task.js
│   ├── Team.js
│   └── User.js
│
├── routes/
│   ├── auth.js
│   ├── tasks.js
│   └── teams.js
│
├── utils/
│   └── sendEmail.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js


frontend/
│
├── public/
│   └── logo.png
│
├── src/
│   ├── components/
│   │   ├── AcceptInvite.jsx
│   │   ├── CreateTeamModal.jsx
│   │   ├── Dashboard.jsx
│   │   ├── JoinTeamModal.jsx
│   │   ├── Loading.jsx
│   │   ├── Login.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskStats.jsx
│   │   ├── TeamDashboard.jsx
│   │   ├── TeamView.jsx
│   │   └── Tooltip.jsx
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx
│   │
│   ├── services/
│   │   └── teamService.js
│   │
│   ├── utils/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
│
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── package-lock.json
```

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
   Create a `.env` file :
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
- **Profile Management:** Users can view and update their profile information.
- **Interactive UI:** Tooltips, loading states, and smooth transitions for better UX.

## Challenges and Solutions

1. **Challenge: Complex State Management**
   Managing the state for both personal tasks and team-based tasks within the same dashboard was complex.
   **Solution:** I implemented a dual-view architecture using React Context for global authentication state and localized state management for the Dashboard and Team views to ensure smooth transitions and data integrity.

2. **Challenge: Secure Team Invitations**
   Creating a secure way to invite users to teams without exposing sensitive data.
   **Solution:** Developed a token-based invitation system where unique, time-limited tokens are generated and sent via email. These tokens are validated on the backend before granting team membership.

3. **Challenge: Responsive Data Presentation**
   Displaying complex task data and statistics on mobile devices was challenging.
   **Solution:** Utilized Tailwind CSS to create a fluid grid system that transforms from multi-column layouts on desktop to stacked card views on mobile, ensuring all features remain accessible.

## Future Scope

- Role-based access control
- Real-time updates using WebSockets
- Email and in-app reminders
- React Native mobile application
