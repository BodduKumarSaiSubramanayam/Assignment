# Full Stack Web Application Assignment

This repository contains the full stack web application for the internship assignment, built using the MERN stack (MongoDB, Express, React, Node.js).

## Features
*   **Login & Registration Page**: Validates email and password, displays contextual error messages, and uses JWT authentication.
*   **Protected Dashboard Page**: Shows a premium UI displaying the logged-in user's name and dummy data (Leads, Tasks, Users, Activity).
*   **Bonus Features**: Implemented Logout functionality, Loading States, Error Handling, Tailwind CSS styling, and Protected React routes.

## Folder Structure
*   `frontend/`: Vite + React + TailwindCSS application.
*   `backend/`: Node.js + Express + Mongoose API server.

## Local Setup Instructions

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory based on `.env.example`:
    ```bash
    PORT=5000
    MONGO_URI=your_mongodb_cluster_uri_here
    JWT_SECRET=any_secret_key
    ```
    *(If you don't have a Mongo URI, local mongod at mongodb://localhost:27017/fullstack-assignment is used by default if running locally).*
4.  Start the backend server:
    ```bash
    node server.js
    ```
    The server will run on `http://localhost:5000`.

### 2. Frontend Setup
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    The app will usually start on `http://localhost:5173`. Open this URL in your browser.

## Deployment Guide (Bonus)

To deploy the application to live services:

### Deploying the Backend (Render)
1.  Push this entire project to a GitHub repository.
2.  Go to [Render.com](https://render.com) and create a new "Web Service".
3.  Connect your GitHub repository and change the "Root Directory" to `backend`.
4.  Set the Build Command to `npm install` and the Start Command to `node server.js`.
5.  Set your Environment Variables (`MONGO_URI` and `JWT_SECRET`).
6.  Deploy!

### Deploying the Frontend (Vercel or Netlify)
1.  Go to [Vercel.com](https://vercel.com) or Netlify.
2.  Import the same GitHub repository.
3.  Set the "Root Directory" / "Base Directory" to `frontend`.
4.  The platform will automatically detect Vite. Build command: `npm run build`, Output directory: `dist`.
5.  *Important*: Also ensure you change the `axios` base URL in your React code (`Login.jsx`, `Register.jsx`, `Dashboard.jsx`) to point to your live Render backend URL instead of `http://localhost:5000`.
6.  Deploy!
