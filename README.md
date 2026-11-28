<p align="center">
  <img src="frontend/public/favicon.svg" width="68" alt="Cortexa Logo" />
</p>

<h1 align="center">Cortexa — Automation AI</h1>

<p align="center">
  A full-stack <strong>Autonomous Multi-Agent AI Platform</strong> engineered with <strong>LangGraph</strong>, <strong>Model Context Protocol (MCP)</strong>, <strong>Groq LLM</strong>, <strong>Tavily Search</strong>, and <strong>Human-in-the-Loop (HITL)</strong> approval guardrails.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/LangGraph-1.7-blue?logo=chainlink" alt="LangGraph" />
  <img src="https://img.shields.io/badge/Model_Context_Protocol-MCP-purple" alt="MCP" />
  <img src="https://img.shields.io/badge/Groq-Qwen_27B-orange?logo=fastapi" alt="Groq" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite 8" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Workflow](#architecture--workflow)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Firebase Configuration](#4-firebase-configuration)
- [Environment Variables](#environment-variables)
  - [Backend Configuration (`.env.example`)](#backend-configuration-envexample)
  - [Frontend Configuration (`.env.example`)](#frontend-configuration-envexample)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
  - [Authentication Endpoints (`/api/auth`)](#authentication-endpoints-apiauth)
  - [Agent Management Endpoints (`/api/agent`)](#agent-management-endpoints-apiagent)
  - [AI & Multi-Agent Execution Endpoints (`/api/ai`)](#ai--multi-agent-execution-endpoints-apiai)
- [Database Models](#database-models)
- [Vercel Deployment Guide](#vercel-deployment-guide)
- [Security Best Practices](#security-best-practices)
- [License](#license)

---

## Overview

**Cortexa (Automation AI)** is an enterprise-grade agentic workflow platform. Users can create specialized, custom-prompted AI agents, equip them with tools via the **Model Context Protocol (MCP)**, execute real-time web searches with **Tavily**, and engage in multi-turn conversational reasoning backed by **LangGraph** with persistent **MongoDB thread checkpoints**. Sensitive actions (such as sending emails or publishing social posts) are guarded with an integrated **Human-in-the-Loop (HITL)** approval flow.

---

## Key Features

- 🧠 **Dynamic LangGraph StateGraph** — State-managed AI graphs capable of reasoning, tool calls, and automated cyclic execution.
- 🔌 **Model Context Protocol (MCP)** — Native integration with MCP servers using `@langchain/mcp-adapters` for extensible tools over standard I/O transports.
- ⚡ **Ultra-Fast LLM Inference** — Powered by Groq's high-throughput LPU running state-of-the-art open-weights models (`qwen/qwen3.8-27b`).
- 🌐 **Live Web Search** — Real-time factual retrieval powered by the Tavily Search API.
- 💾 **Persistent Thread Checkpointing** — Conversation state and tool-call history persist to MongoDB collections via `@langchain/langgraph-checkpoint-mongodb`.
- 🛡️ **Human-in-the-Loop (HITL) Guardrails** — Sensitive operations trigger interactive approval cards before execution.
- 🔐 **Secure Google OAuth Authentication** — Seamless sign-in via Firebase Web SDK with backend token verification and HTTP-only signed JWT cookies.
- 🎨 **Modern Glassmorphic UI** — Built on React 19, Tailwind CSS v4, shadcn UI components, and Redux Toolkit.
- 🚀 **Fullstack Monorepo Deployment** — Pre-configured `vercel.json` for seamless deployment of both Express API serverless functions and Vite SPA client.

---

## Architecture & Workflow

```
                                      ┌────────────────────────┐
                                      │   User (React 19 UI)   │
                                      └───────────┬────────────┘
                                                  │
                                          HTTP /api/ai/agent
                                                  │
                                      ┌───────────▼────────────┐
                                      │ Express.js Auth & API  │
                                      └───────────┬────────────┘
                                                  │
                                      ┌───────────▼────────────┐
                                      │  LangGraph StateGraph  │
                                      └─────┬────────────┬─────┘
                                            │            │
                   ┌────────────────────────┘            └─────────────────────────┐
                   ▼                                                               ▼
        ┌─────────────────────┐                                         ┌─────────────────────┐
        │     Chat Node       │◄───────────── Cyclic Loop ─────────────►│      Tool Node      │
        │ (Groq Qwen 27B LLM) │                                         │ (MCP / Tavily Search│
        └──────────┬──────────┘                                         └──────────┬──────────┘
                   │                                                               │
                   │                                                    Requires Approval?
                   ▼                                                               │
        ┌─────────────────────┐                                                    ▼
        │    MongoDB Saver    │                                         ┌─────────────────────┐
        │ (Thread Checkpoint) │                                         │ Human-in-the-Loop   │
        └─────────────────────┘                                         │   Approval Node     │
                                                                        └─────────────────────┘
```

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Express.js** | `^5.3.0` | Next-generation Web Framework & REST API |
| **@langchain/langgraph** | `^1.7.5` | Cyclic multi-agent graph orchestrator |
| **@langchain/groq** | `^1.3.2` | Groq cloud LLM provider integration |
| **@langchain/tavily** | `^1.2.1` | Tavily live internet search engine integration |
| **@langchain/mcp-adapters** | `^2.0.3` | Model Context Protocol adapter for LangChain |
| **@modelcontextprotocol/server** | `^2.4.0` | MCP Server SDK over stdio transport |
| **@langchain/langgraph-checkpoint-mongodb** | `^1.5.2` | Persistent thread memory storage in MongoDB |
| **mongoose** & **mongodb** | `^9.12.0` / `^7.9.1` | MongoDB Object Data Modeling and native client |
| **firebase-admin** | `^14.5.1` | Server-side Firebase ID token verification |
| **jsonwebtoken** | `^9.0.3` | JWT generation & verification for auth sessions |
| **cookie-parser** & **cors** | `^1.4.7` / `^2.8.6` | Cookie handling and Cross-Origin Resource Sharing |
| **zod** | `^4.6.7` | Declarative schema validation |
| **dotenv** | `^18.0.9` | Environment variable loader |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** & **React DOM** | `^19.3.1` | Modern concurrent UI library |
| **Vite** | `^8.3.6` | Next-generation frontend build tool |
| **Tailwind CSS** | `^4.3.5` | Modern utility-first styling engine |
| **React Router DOM** | `^7.18.5` | Client-side routing and protected navigations |
| **@reduxjs/toolkit** & **react-redux** | `^2.14.0` / `^9.3.1` | Predictable centralized state management |
| **Firebase** | `^13.3.0` | Firebase Web Client SDK (Google Authentication) |
| **shadcn** & **@base-ui/react** | `^4.23.0` / `^1.9.0` | Accessible, customizable UI primitives |
| **lucide-react** & **react-icons** | `^1.72.0` / `^5.7.0` | Icon sets |
| **axios** | `^1.21.1` | Promise-based HTTP client |

---

## Project Directory Structure

```
Automation_AI/
├── package.json                         # Monorepo root configuration & scripts
├── vercel.json                          # Vercel deployment & serverless routing
├── .gitignore                           # Git ignore rules for credentials & builds
│
├── backend/
│   ├── server.js                        # Local development server entry point
│   ├── package.json                     # Backend dependencies & overrides
│   ├── .env.example                     # Environment template (NO real secrets)
│   ├── serviceAccountKey.json           # Firebase Admin key (Git-ignored)
│   └── src/
│       ├── index.js                     # Express app, CORS, routes & middleware
│       ├── config/
│       │   ├── ENV.config.js            # Environment validation & exports
│       │   ├── db.config.js             # Mongoose connection with serverless cache
│       │   ├── firebase.js              # Resilient Firebase Admin initializer
│       │   └── llm.config.js            # Groq Qwen LLM configuration
│       ├── controllers/
│       │   ├── auth.controller.js       # Login, logout, getMe handlers
│       │   ├── agent.controller.js      # Agent CRUD operations
│       │   └── chat.controller.js       # LangGraph AI chat & Agent graph invoke
│       ├── middlewares/
│       │   └── auth.middleware.js        # JWT token authentication middleware
│       ├── models/
│       │   ├── user.model.js            # User database schema
│       │   └── agent.model.js           # Agent database schema
│       ├── routes/
│       │   ├── auth.route.js            # /api/auth routes
│       │   ├── agent.route.js           # /api/agent routes
│       │   └── chat.route.js            # /api/ai routes
│       └── services/
│           ├── chatGraph.js             # Basic conversational StateGraph
│           ├── graph/
│           │   └── agent.graph.js       # Multi-agent LangGraph with MCP tools & HITL
│           └── mcp/
│               ├── mcp-adapter.js       # LangChain adapter for MCP servers
│               └── servers/
│                   └── server.js        # MCP Server providing web_search (Tavily)
│
├── frontend/
│   ├── index.html                       # HTML document template
│   ├── vite.config.js                   # Vite bundler & path aliases
│   ├── package.json                     # Frontend dependencies
│   ├── .env.example                     # Frontend environment template
│   ├── components.json                  # shadcn component settings
│   └── src/
│       ├── main.jsx                     # Application bootstrap (Redux + Router)
│       ├── App.jsx                      # Route configurations & auth guards
│       ├── firebase.js                  # Firebase Client SDK configuration
│       ├── api/
│       │   └── axios.js                 # Axios instance with credentials
│       ├── app/
│       │   └── store.js                 # Redux Toolkit store setup
│       ├── features/
│       │   ├── auth/                    # Auth slice, APIs, and custom hooks
│       │   └── agent/                   # Agent state, APIs, and custom hooks
│       ├── components/                  # UI components, layouts & login form
│       └── pages/                       # Login, Home, Agents, CreateAgent, Integrations
│
└── README.md
```

---

## Prerequisites

Ensure you have the following installed before running the project:

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- **Groq Cloud Account**: Free API key from [Groq Console](https://console.groq.com/keys)
- **Tavily AI Account**: Free API key from [Tavily](https://tavily.com/)
- **Firebase Project**: Created via [Firebase Console](https://console.firebase.google.com/)

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/PARTH-7773/Cortexa.AI.git
cd Cortexa.AI
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env

# Edit .env with your credentials (see Environment Variables section)
```

Place your Firebase Admin private key at `backend/serviceAccountKey.json` (or set `FIREBASE_SERVICE_ACCOUNT` in `.env`).

```bash
# Start backend in development mode
npm run dev
```
The backend server runs at **`http://localhost:5000`** (or your configured `PORT`).

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env

# Start frontend development server
npm run dev
```
The frontend dev server runs at **`http://localhost:5173`**.

### 4. Firebase Configuration

1. In the [Firebase Console](https://console.firebase.google.com/):
   - Navigate to **Authentication ➔ Sign-in method** and enable **Google**.
   - Navigate to **Authentication ➔ Settings ➔ Authorized Domains** and add:
     - `localhost`
     - Your production domain (e.g., `your-app.vercel.app`)
2. In **Project Settings ➔ Service Accounts**:
   - Click **Generate New Private Key**.
   - Save the file as `backend/serviceAccountKey.json`.
3. In **Project Settings ➔ General ➔ Your apps (Web app)**:
   - Copy `apiKey` and set it as `VITE_FIREBASE_API_KEY` in `frontend/.env`.

---

## Environment Variables

### Backend Configuration (`.env.example`)

Reference file: [`backend/.env.example`](file:///e:/Development/import-with-Backend/Agentic%20AI/Project_Agentic_AI/Automation_AI/backend/.env.example)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Local HTTP server port |
| `MONGO_URL` | **Yes** | — | MongoDB connection string (Local or MongoDB Atlas) |
| `JWT_SECRET` | **Yes** | — | Secret string for signing auth session JWT tokens |
| `GROQ_API_KEY` | **Yes** | — | API key for Groq LLM inference (`ChatGroq`) |
| `TAVILY_API_KEY` | **Yes** | — | API key for real-time web search in MCP server |
| `FIREBASE_SERVICE_ACCOUNT` | Cloud only | — | Full JSON string of `serviceAccountKey.json` for Vercel/cloud hosting |

Example `backend/.env`:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/cortexa_ai
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
TAVILY_API_KEY=tvly-your_tavily_api_key_here
```

### Frontend Configuration (`.env.example`)

Reference file: [`frontend/.env.example`](file:///e:/Development/import-with-Backend/Agentic%20AI/Project_Agentic_AI/Automation_AI/frontend/.env.example)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | **Yes** | — | Firebase Web API Key for client-side Google OAuth popup |
| `VITE_SERVER_URL` | No | `/api` | Backend API Base URL (`http://localhost:5000/api` for local) |

Example `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy_your_firebase_api_key_here
VITE_SERVER_URL=http://localhost:5000/api
```

---

## Available Scripts

### Root Monorepo
| Command | Description |
|---|---|
| `npm run build` | Builds the frontend project (`npm --prefix frontend run build`) |

### Backend (`/backend`)
| Command | Description |
|---|---|
| `npm run dev` | Runs backend with `nodemon` for auto-reloading on changes |
| `npm start` | Runs backend production server with `node server.js` |

### Frontend (`/frontend`)
| Command | Description |
|---|---|
| `npm run dev` | Starts Vite HMR dev server |
| `npm run build` | Generates production build in `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs ESLint to check for code issues |

---

## API Reference

Base URL: `http://localhost:5000/api` (Local) or `/api` (Production)

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/auth/health` | No | Server health check endpoint |
| `POST` | `/api/auth/login` | No | Verifies Firebase ID token & sets session cookie |
| `GET` | `/api/auth/logout` | No | Clears session cookie and logs user out |
| `GET` | `/api/auth/me` | **Yes** | Retrieves currently authenticated user profile |

#### `POST /api/auth/login`
**Request Body:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIs..."
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfull..",
  "user": {
    "_id": "67420f1b2c...",
    "firebaseUId": "firebase_uid_123",
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "profilePicture": "https://lh3.googleusercontent.com/..."
  }
}
```

---

### Agent Management Endpoints (`/api/agent`)

All agent routes require authentication via session cookie.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/agent/create` | **Yes** | Creates a new agent with instructions & tools |
| `GET` | `/api/agent/all` | **Yes** | Fetches all agents belonging to the logged-in user |
| `GET` | `/api/agent/:id` | **Yes** | Fetches agent by ID |
| `DELETE` | `/api/agent/:id` | **Yes** | Deletes agent by ID |

#### `POST /api/agent/create`
**Request Body:**
```json
{
  "name": "Research Analyst",
  "knowledgeBase": "You are an expert AI market research analyst.",
  "instructions": "Search the web for up-to-date data, cite sources, and structure findings clearly.",
  "tools": ["web_search", "calculator"]
}
```

---

### AI & Multi-Agent Execution Endpoints (`/api/ai`)

All AI invocation routes require authentication via session cookie.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/ai/chat` | **Yes** | General conversational chat graph with MongoDB memory |
| `POST` | `/api/ai/agent` | **Yes** | Executes customized agent LangGraph with MCP tools |

#### `POST /api/ai/agent`
Executes the specific agent's LangGraph StateGraph, binding MCP tools and preserving per-user conversation threads in MongoDB.

**Request Body:**
```json
{
  "agent": "Research Analyst",
  "message": "What were the major AI breakthroughs announced this week?"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Agent graph run's succedded.",
  "aiMessage": "Based on the latest web research from Tavily: ..."
}
```

---

## Database Models

### User Schema (`User`)
- `firebaseUId` *(String, unique, required)* — Unique identifier from Firebase Authentication.
- `name` *(String, required)* — User's display name.
- `email` *(String, unique, required, lowercase)* — User's email address.
- `profilePicture` *(String)* — Profile avatar URL from Google OAuth.
- `timestamps` *(createdAt, updatedAt)*.

### Agent Schema (`Agent`)
- `userId` *(ObjectId, ref: User, required)* — Owner of the agent.
- `name` *(String, required, unique)* — Unique name of the agent.
- `knowledgeBase` *(String, required)* — Persona, role, and domain boundaries.
- `instructions` *(String, required)* — Operational guidelines and rules.
- `tools` *(Array of Strings)* — Enabled tool identifiers (e.g. `web_search`, `calculator`).
- `isActive` *(Boolean, default: true)* — Status flag.
- `timestamps` *(createdAt, updatedAt)*.

---

## Vercel Deployment Guide

This project includes a production-ready `vercel.json` configured for a monorepo setup:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.js"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/frontend/assets/$1"
    },
    {
      "src": "/(.*\\.(?:js|css|ico|png|jpg|jpeg|svg|woff2|woff|ttf|json|webp))",
      "dest": "/frontend/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/index.html"
    }
  ]
}
```

### Steps to Deploy on Vercel:
1. Connect your repository to Vercel.
2. In Vercel **Project Settings ➔ Environment Variables**, add:
   - `MONGO_URL`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `TAVILY_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT` *(paste the entire JSON content of your `serviceAccountKey.json` as a single string)*
3. In **Firebase Console ➔ Authentication ➔ Settings ➔ Authorized Domains**, add your Vercel deployment URL (e.g., `your-project.vercel.app`).
4. Trigger a deployment. Vercel will build both the frontend SPA and the serverless backend API.

---

## Security Best Practices

- 🚫 **Never Commit `.env` Files**: Keep your real API keys (`GROQ_API_KEY`, `TAVILY_API_KEY`, `JWT_SECRET`) strictly in your local `.env` and Vercel dashboard.
- 🔑 **Keep `serviceAccountKey.json` Secret**: This file is excluded in `.gitignore`. Use the `FIREBASE_SERVICE_ACCOUNT` environment variable for cloud deployments.
- 🍪 **HTTP-Only Cookies**: Authentication session tokens are stored in `httpOnly`, `sameSite` protected cookies to mitigate XSS exposure.
- 🛡️ **HITL Enforcement**: Sensitive agent tool calls are routed through the approval node before any write actions occur.

---

## License

This project is licensed under the **ISC License**.

<p align="center">
  Built with ❤️ by the Cortexa Team
</p>
