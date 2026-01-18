# REST API Project

A simple and modular REST API built with Node.js and Express.

## Features

- Express-based REST API - MVC-style project structure
- User Authentication (Login/Register)
- Role-Based Access Control (Admin/User)
- Centralized error handling
- Environment configuration support
- **Frontend UI generated using AI tools**

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB running
- .env file configured

## Usage

### Login Page

- Access the login/register page at `http://localhost:{PORT}`
- Enter your credentials

### API Endpoints

All API endpoints are accessible at `http://localhost:{PORT}/api`

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

## Security Features

- JWT tokens
- HttpOnly cookies
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
