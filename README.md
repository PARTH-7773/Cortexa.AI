<p align="center">
  <img src="frontend/public/favicon.svg" width="60" alt="Automation AI Logo" />
</p>

<h1 align="center">Automation AI</h1>

<p align="center">
  A full-stack <strong>AI Agent Orchestration Platform</strong> with multi-agent workflows, MCP tool integrations, and human-in-the-loop (HITL) approval guardrails.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-black?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Firebase Setup](#4-firebase-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
  - [Auth Endpoints](#auth-endpoints)
  - [Agent Endpoints](#agent-endpoints)
- [Database Models](#database-models)
- [Frontend Pages & Routes](#frontend-pages--routes)
- [State Management](#state-management)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Automation AI** is a platform that lets users create, manage, and orchestrate AI agents equipped with tools (web search, email, calculator) and MCP (Model Context Protocol) integrations. It features a demo chat workspace with real-time agent interaction, human-in-the-loop email drafting approval, and an integrations dashboard for connecting external services.

---

## Features

- 🔐 **Google OAuth Authentication** — Sign in via Firebase Google Auth with secure JWT session cookies
- 🤖 **AI Agent CRUD** — Create, view, list, and delete custom AI agents with configurable tools
- 💬 **Interactive Chat Workspace** — Demo chat interface with agent-based responses and email command detection
- ✉️ **Human-in-the-Loop Email Drafts** — AI-drafted emails require human approval before sending
- 🔧 **MCP Tool Integrations** — Connect Gmail, Instagram, X (Twitter), Web Search, and Calculator tools
- 🛡️ **HITL Guardrails** — Toggle human-in-the-loop requirements per integration
- 🎨 **Modern Glass-Morphism UI** — Polished dark theme with tilt-cards, parallax scrolling, and scroll-aware headers
- 📱 **Responsive Design** — Fully responsive across desktop and mobile viewports

---

## Tech Stack

### Backend

| Dependency         | Version | Purpose                                   |
| ------------------ | ------- | ----------------------------------------- |
| **express**        | ^5.3.0  | Web framework & REST API                  |
| **mongoose**       | ^9.12.0 | MongoDB ODM for data modeling             |
| **firebase-admin** | ^14.5.1 | Server-side Firebase token verification   |
| **jsonwebtoken**   | ^9.0.3  | JWT generation & validation for sessions  |
| **cookie-parser**  | ^1.4.7  | Parse cookies from HTTP requests          |
| **cors**           | ^2.8.6  | Cross-origin resource sharing middleware  |
| **dotenv**         | ^18.0.9 | Environment variable management           |
| **nodemon**        | ^3.1.14 | Auto-restart server on file changes (dev) |

### Frontend

| Dependency                   | Version | Purpose                         |
| ---------------------------- | ------- | ------------------------------- |
| **react**                    | ^19.3.1 | UI library                      |
| **react-dom**                | ^19.3.1 | React DOM renderer              |
| **react-router-dom**         | ^7.18.5 | Client-side routing             |
| **@reduxjs/toolkit**         | ^2.14.0 | State management                |
| **react-redux**              | ^9.3.1  | React bindings for Redux        |
| **axios**                    | ^1.21.1 | HTTP client for API calls       |
| **firebase**                 | ^13.3.0 | Firebase Auth (Google sign-in)  |
| **tailwindcss**              | ^4.3.5  | Utility-first CSS framework     |
| **@tailwindcss/vite**        | ^4.3.5  | Tailwind CSS Vite plugin        |
| **shadcn**                   | ^4.23.0 | Accessible UI component library |
| **@base-ui/react**           | ^1.9.0  | Base UI primitives for shadcn   |
| **lucide-react**             | ^1.72.0 | Icon library                    |
| **react-icons**              | ^5.7.0  | Additional icon sets            |
| **class-variance-authority** | ^0.7.1  | Component variant utility       |
| **tw-animate-css**           | ^1.4.0  | Tailwind animation utilities    |

### Dev Dependencies (Frontend)

| Dependency               | Version  | Purpose                 |
| ------------------------ | -------- | ----------------------- |
| **vite**                 | ^8.3.6   | Build tool & dev server |
| **@vitejs/plugin-react** | ^6.1.2   | React support for Vite  |
| **eslint**               | ^10.14.0 | Code linting            |

---

## Project Structure

```
Automation_AI/
├── backend/
│   ├── server.js                        # Entry point — starts Express + connects DB
│   ├── package.json
│   ├── .env                             # Backend environment variables
│   ├── serviceAccountKey.json           # Firebase Admin SDK service account (DO NOT commit)
│   └── src/
│       ├── index.js                     # Express app setup (middleware, routes)
│       ├── config/
│       │   ├── ENV.config.js            # Env variable validation & export
│       │   ├── db.config.js             # MongoDB connection
│       │   └── firebase.js              # Firebase Admin initialization
│       ├── controllers/
│       │   ├── auth.controller.js       # Login, logout, getMe handlers
│       │   └── agent.controller.js      # Agent CRUD handlers
│       ├── middlewares/
│       │   └── auth.middleware.js        # JWT verification middleware
│       ├── models/
│       │   ├── user.model.js            # User Mongoose schema
│       │   └── agent.model.js           # Agent Mongoose schema
│       └── routes/
│           ├── auth.route.js            # Auth route definitions
│           └── agent.route.js           # Agent route definitions
│
├── frontend/
│   ├── index.html                       # HTML entry point
│   ├── vite.config.js                   # Vite configuration
│   ├── package.json
│   ├── .env                             # Frontend environment variables
│   ├── components.json                  # shadcn configuration
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx                     # React entry (Provider + BrowserRouter)
│       ├── App.jsx                      # Route definitions
│       ├── firebase.js                  # Firebase client initialization
│       ├── api/
│       │   └── axios.js                 # Axios instance with base URL
│       ├── app/
│       │   └── store.js                 # Redux store configuration
│       ├── features/
│       │   ├── auth/
│       │   │   ├── auth.api.js          # Auth API calls (login, logout, getMe)
│       │   │   ├── authSlice.js         # Auth Redux slice
│       │   │   └── hooks/
│       │   │       └── useAuth.js       # Auth custom hook
│       │   └── agent/
│       │       ├── agents.api.js        # Agent API calls (CRUD)
│       │       └── hooks/
│       │           └── useAgent.js      # Agent custom hook
│       ├── components/
│       │   ├── login-form.jsx           # Google sign-in form
│       │   ├── ProtectedRoute.jsx       # Auth guard component
│       │   └── ui/                      # shadcn UI components
│       │       ├── button.jsx
│       │       ├── card.jsx
│       │       ├── dropdown-menu.jsx
│       │       ├── field.jsx
│       │       ├── input.jsx
│       │       ├── label.jsx
│       │       ├── separator.jsx
│       │       └── textarea.jsx
│       ├── pages/
│       │   ├── Login.jsx                # Login page
│       │   ├── Home.jsx                 # Main dashboard with chat workspace
│       │   ├── Agents.jsx               # Agent listing page
│       │   ├── CreateAgent.jsx          # Agent creation form
│       │   └── Integrations.jsx         # MCP integrations dashboard
│       └── lib/
│           └── utils.js                 # Utility functions (cn)
│
└── README.md
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool                 | Version | Download                                                                                                         |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| **Node.js**          | >= 18.x | [nodejs.org](https://nodejs.org/)                                                                                |
| **npm**              | >= 9.x  | Comes with Node.js                                                                                               |
| **MongoDB**          | >= 6.x  | [mongodb.com](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://cloud.mongodb.com/) |
| **Firebase Project** | —       | [Firebase Console](https://console.firebase.google.com/)                                                         |
| **Git**              | Latest  | [git-scm.com](https://git-scm.com/)                                                                              |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Automation_AI.git
cd Automation_AI
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Start development server
npm run dev
```

The backend server will start at **`http://localhost:8080`** (or your configured `PORT`).

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Start development server
npm run dev
```

The frontend dev server will start at **`http://localhost:5173`**.

### 4. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2. **Enable Google Authentication:**
   - Navigate to **Authentication → Sign-in method → Google** and enable it.
3. **Generate a Service Account Key (Backend):**
   - Go to **Project Settings → Service Accounts → Generate New Private Key**.
   - Save the downloaded JSON as `backend/serviceAccountKey.json`.

   > ⚠️ **Never commit `serviceAccountKey.json` to version control.** Add it to `.gitignore`.

4. **Get Firebase Web Config (Frontend):**
   - Go to **Project Settings → General → Your apps → Web app**.
   - Copy the `apiKey` and set it as `VITE_FIREBASE_API_KEY` in `frontend/.env`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable     | Description                       | Example                                   |
| ------------ | --------------------------------- | ----------------------------------------- |
| `PORT`       | Server port number                | `8080`                                    |
| `MONGO_URL`  | MongoDB connection string         | `mongodb://localhost:27017/automation_ai` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_jwt_key_here`          |

```env
PORT=8080
MONGO_URL=mongodb://localhost:27017/automation_ai
JWT_SECRET=your_super_secret_jwt_key_here
```

### Frontend (`frontend/.env`)

| Variable                | Description          | Example                     |
| ----------------------- | -------------------- | --------------------------- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key | `AIzaSyXXXXXXXXXXXXXXXXXX`  |
| `VITE_SERVER_URL`       | Backend API base URL | `http://localhost:8080/api` |

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_SERVER_URL=http://localhost:8080/api
```

---

## Available Scripts

### Backend

| Command       | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `npm run dev` | Start the server with **nodemon** (auto-restart on changes) |
| `npm test`    | Run tests (not configured yet)                              |

### Frontend

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Build optimized production bundle    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint to check for code issues  |

---

## API Reference

**Base URL:** `http://localhost:8080/api`

All responses follow this format:

```json
{
  "success": true | false,
  "message": "Description of the result",
  "data": { }
}
```

### Auth Endpoints

Authentication uses Firebase Google sign-in on the frontend. The Firebase ID token is sent to the backend, which verifies it, creates/updates the user in MongoDB, and returns a JWT session cookie.

| Method | Endpoint           | Auth | Description                            |
| ------ | ------------------ | ---- | -------------------------------------- |
| `GET`  | `/api/auth/health` | ❌   | Health check                           |
| `POST` | `/api/auth/login`  | ❌   | Login with Firebase token              |
| `GET`  | `/api/auth/logout` | ❌   | Logout and clear session cookie        |
| `GET`  | `/api/auth/me`     | ✅   | Get current authenticated user profile |

#### `GET /api/auth/health`

Health check endpoint.

**Response:**

```json
{
  "success": true,
  "message": "All good.."
}
```

---

#### `POST /api/auth/login`

Authenticate a user with their Firebase ID token.

**Request Body:**

```json
{
  "token": "<firebase_id_token>"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Successfull..",
  "user": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "firebaseUId": "abc123xyz",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
}
```

**Cookie Set:**
| Name | Value | HttpOnly | Secure | SameSite | MaxAge |
|---|---|---|---|---|---|
| `token` | JWT string | ✅ | ❌ (dev) | Strict | 3 days |

**Error Response (400):**

```json
{
  "success": false,
  "message": "Token not found"
}
```

---

#### `GET /api/auth/logout`

Clear the authentication cookie and log the user out.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout Successfull..",
  "user": null
}
```

---

#### `GET /api/auth/me`

Get the currently authenticated user's profile.

**Headers:** Requires `token` cookie (set during login).

**Success Response (200):**

```json
{
  "success": true,
  "message": "Getting the user profile.",
  "user": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "firebaseUId": "abc123xyz",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

### Agent Endpoints

All agent endpoints require authentication via the JWT cookie set during login.

| Method   | Endpoint            | Auth | Description                         |
| -------- | ------------------- | ---- | ----------------------------------- |
| `POST`   | `/api/agent/create` | ✅   | Create a new AI agent               |
| `GET`    | `/api/agent/all`    | ✅   | Get all agents for the current user |
| `GET`    | `/api/agent/:id`    | ✅   | Get a specific agent by ID          |
| `DELETE` | `/api/agent/:id`    | ✅   | Delete an agent by ID               |

#### `POST /api/agent/create`

Create a new AI agent with custom configuration.

**Request Body:**

```json
{
  "name": "Research Assistant",
  "knowledgeBase": "You are a helpful AI research assistant...",
  "instructions": "Search the web for recent papers and summarize findings.",
  "tools": ["web.search", "calculator"]
}
```

| Field           | Type       | Required | Description                                   |
| --------------- | ---------- | -------- | --------------------------------------------- |
| `name`          | `string`   | ✅       | Display name of the agent                     |
| `knowledgeBase` | `string`   | ✅       | The agent's system prompt / knowledge context |
| `instructions`  | `string`   | ✅       | Specific instructions for the agent           |
| `tools`         | `string[]` | ❌       | Array of tool IDs to enable                   |

**Available Tool IDs:**

| Tool ID      | Display Name | Description                       |
| ------------ | ------------ | --------------------------------- |
| `calculator` | Calculator   | Perform mathematical calculations |
| `web.search` | Web Search   | Search for information on the web |
| `gmail.read` | Read Gmail   | Read and summarize emails         |
| `gmail.send` | Send Emails  | Draft and send emails             |

**Success Response (201):**

```json
{
  "success": true,
  "message": "Agent create successfully",
  "agent": {
    "_id": "665b2c3d4e5f6a7b8c9d0e1f",
    "userId": "665a1b2c3d4e5f6a7b8c9d0e",
    "name": "Research Assistant",
    "knowledgeBase": "You are a helpful AI research assistant...",
    "instructions": "Search the web for recent papers...",
    "tools": ["web.search", "calculator"],
    "isActive": true,
    "createdAt": "2024-06-01T12:00:00.000Z",
    "updatedAt": "2024-06-01T12:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "All fields are required for creating new agent"
}
```

---

#### `GET /api/agent/all`

Retrieve all agents belonging to the authenticated user.

**Success Response (200):**

```json
{
  "success": true,
  "message": "All agents fetched",
  "agent": [
    {
      "_id": "665b2c3d4e5f6a7b8c9d0e1f",
      "userId": "665a1b2c3d4e5f6a7b8c9d0e",
      "name": "Research Assistant",
      "knowledgeBase": "...",
      "instructions": "...",
      "tools": ["web.search", "calculator"],
      "isActive": true,
      "createdAt": "2024-06-01T12:00:00.000Z",
      "updatedAt": "2024-06-01T12:00:00.000Z"
    }
  ]
}
```

---

#### `GET /api/agent/:id`

Retrieve a specific agent by its MongoDB ObjectId.

**URL Parameters:**

| Parameter | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `id`      | `string` | MongoDB ObjectId of the agent |

**Success Response (200):**

```json
{
  "success": true,
  "message": "get agent succedded",
  "agent": {
    "_id": "665b2c3d4e5f6a7b8c9d0e1f",
    "userId": "665a1b2c3d4e5f6a7b8c9d0e",
    "name": "Research Assistant",
    "knowledgeBase": "...",
    "instructions": "...",
    "tools": ["web.search", "calculator"],
    "isActive": true,
    "createdAt": "2024-06-01T12:00:00.000Z",
    "updatedAt": "2024-06-01T12:00:00.000Z"
  }
}
```

---

#### `DELETE /api/agent/:id`

Delete a specific agent by its MongoDB ObjectId.

**URL Parameters:**

| Parameter | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `id`      | `string` | MongoDB ObjectId of the agent |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Delete agent successfully"
}
```

---

## Database Models

### User Model

| Field            | Type     | Required | Unique | Description                |
| ---------------- | -------- | -------- | ------ | -------------------------- |
| `firebaseUId`    | `String` | ✅       | ✅     | Firebase unique identifier |
| `name`           | `String` | ✅       | ❌     | User's display name        |
| `email`          | `String` | ✅       | ✅     | User's email (lowercase)   |
| `profilePicture` | `String` | ❌       | ❌     | Google profile picture URL |
| `createdAt`      | `Date`   | auto     | ❌     | Timestamp (Mongoose)       |
| `updatedAt`      | `Date`   | auto     | ❌     | Timestamp (Mongoose)       |

### Agent Model

| Field           | Type       | Required | Default | Description                       |
| --------------- | ---------- | -------- | ------- | --------------------------------- |
| `userId`        | `ObjectId` | ✅       | —       | Reference to User model           |
| `name`          | `String`   | ✅       | —       | Agent display name                |
| `knowledgeBase` | `String`   | ✅       | —       | System prompt / knowledge context |
| `instructions`  | `String`   | ✅       | —       | Agent-specific instructions       |
| `tools`         | `[String]` | ❌       | `[]`    | Array of enabled tool IDs         |
| `isActive`      | `Boolean`  | ❌       | `true`  | Whether the agent is active       |
| `createdAt`     | `Date`     | auto     | —       | Timestamp (Mongoose)              |
| `updatedAt`     | `Date`     | auto     | —       | Timestamp (Mongoose)              |

---

## Frontend Pages & Routes

| Path           | Component      | Auth Required | Description                                           |
| -------------- | -------------- | ------------- | ----------------------------------------------------- |
| `/login`       | `Login`        | ❌            | Google sign-in page (redirects to `/` if logged in)   |
| `/`            | `Home`         | ✅            | Main dashboard with chat workspace and agent selector |
| `/agents`      | `Agents`       | ✅            | List all user agents                                  |
| `/agent/new`   | `CreateAgent`  | ✅            | Create a new AI agent form                            |
| `/integration` | `Integrations` | ✅            | MCP integrations and HITL configuration dashboard     |

---

## State Management

The app uses **Redux Toolkit** for global state management.

### Auth Slice (`authSlice.js`)

| State Key     | Type             | Description                            |
| ------------- | ---------------- | -------------------------------------- |
| `user`        | `object \| null` | Current authenticated user             |
| `loading`     | `boolean`        | Auth operation in progress             |
| `error`       | `string \| null` | Last auth error message                |
| `initialized` | `boolean`        | Whether initial auth check is complete |

**Actions:** `setUser`, `setLoading`, `setError`, `setInitialized`, `logoutUser`

**Selectors:** `selectUser`, `selectIsAuthenticated`, `selectAuthLoading`, `selectAuthError`, `selectAuthInitialized`

---

## Authentication Flow

```
┌─────────┐    Firebase Google    ┌──────────┐    ID Token     ┌─────────┐
│  User   │ ──── Sign-In ──────► │ Firebase │ ──────────────► │ Backend │
│ (React) │                      │   Auth   │                 │ Express │
└─────────┘                      └──────────┘                 └────┬────┘
                                                                   │
                                                    Verify Token via
                                                    Firebase Admin SDK
                                                                   │
                                                              ┌────▼────┐
                                                              │ MongoDB │
                                                              │ Upsert  │
                                                              │  User   │
                                                              └────┬────┘
                                                                   │
                                                           Sign JWT &
                                                          Set Cookie
                                                                   │
     ┌──────────────────── JWT Cookie (httpOnly) ◄─────────────────┘
     │
     ▼
  Subsequent requests include cookie automatically
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ using React, Express, MongoDB & Firebase
</p>
