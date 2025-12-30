# REST API with Modern Frontend

A complete authentication system with a modern, clean frontend interface.

## Features

- 🔐 User Authentication (Login/Register)
- 🎨 Modern & Clean UI Design
- 📱 Fully Responsive
- 🔒 Protected Dashboard
- 👤 User Profile Management
- 🎯 Role-Based Access Control (Admin/User)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB running
- .env file configured

### Installation

1. Install dependencies (if not already installed):

```bash
npm install
```

2. Create `.env` file in root directory:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_COOKIE_SECRET=your_cookie_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
```

3. Start the server:

```bash
npm start
```

4. Open your browser and navigate to:

```
http://localhost:5000
```

## Usage

### Login Page

- Access the login/register page at `http://localhost:5000`
- Switch between Login and Register tabs
- Enter your credentials

### Dashboard

- After successful login, you'll be redirected to the dashboard
- View your account information
- Admin users can see total users count
- Logout button to end your session

### API Endpoints

All API endpoints are accessible at `http://localhost:5000/api`

#### Auth Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

#### User Routes (Protected)

- `GET /api/user` - Get all users (Admin only)
- `GET /api/user/showme` - Get current user info
- `GET /api/user/:id` - Get specific user
- `PATCH /api/user/updateuser` - Update user info
- `PATCH /api/user/updatepassword` - Update password
- `DELETE /api/user/delete/:id` - Delete user (Admin only)

## Technology Stack

### Backend

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt for password hashing

### Frontend

- Vanilla JavaScript
- Modern CSS3 (Flexbox, Grid, Gradients)
- Responsive Design
- Local Storage for token management

## Security Features

- JWT tokens (Access & Refresh)
- HttpOnly cookies for refresh tokens
- Password hashing with bcrypt
- Protected routes
- Role-based authorization

## File Structure

```
public/
├── index.html          # Login/Register page
├── dashboard.html      # Protected dashboard page
├── styles.css          # All styles
├── app.js             # Auth logic
└── dashboard.js       # Dashboard logic
```

Enjoy! 🚀
