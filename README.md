# Coding Challenges

A full-stack web application for managing coding challenges, built with React (frontend) and Node.js/Express (backend).

## Features

- User authentication (login, register, logout)
- Profile management
- Create, view, and solve coding challenges
- Protected routes for authenticated users
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Node Packacge Manager (npm)
- A MongoDB database

### Installation

1. **Clone the repository:**
```
git clone https://github.com/TarikBeentjes61/Coding-Challenges
```
2. **Install dependencies:**
```
npm install
```
3. **Set up environment variables:**
Create a .env file in the root directory for configuration

Example:
```
# --- Backend configuration ---
PORT=3001 # fallback port
SERVER_ORIGIN=http://localhost:3002
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

# --- Frontend configuration ---
REACT_APP_URL=http://localhost:3001
REACT_APP_API_URL=http://localhost:3001/api
```

4. **Start the backend server:**
```
node server/server.js
```
5. **Start the frontend development server:**
```
npm start
```
   