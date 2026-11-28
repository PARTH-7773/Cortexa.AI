# Cortexa System Architecture & AI Coding Guidelines

> **CRITICAL INSTRUCTIONS FOR AI CODING ASSISTANTS:**  
> This document specifies the architectural patterns, strict contracts, and coding rules for **Cortexa (Automation AI)**.  
> **Read this file carefully before generating, modifying, or refactoring any code in this repository.**  
> Deviating from these conventions will cause runtime crashes, routing 404s, dependency breakage, or broken agent graphs.

---

## 1. Architectural Principles

1. **Modular Monorepo Structure:**
   - `/backend`: Node.js ES Module service (`"type": "module"`).
   - `/frontend`: React 19 Single Page Application (SPA) powered by Vite.
   - Root `/package.json` & `/vercel.json`: Handles unified monorepo builds and cloud serverless routing.

2. **Graph-Centric Agent Execution:**
   - We **never** write direct, one-off LLM prompt calls in controllers.
   - All intelligent behavior runs as a **LangGraph** `StateGraph` with node-based execution, conditional edge routing, tool evaluation, and checkpointed memory.

3. **Decoupled Tool Protocol (MCP):**
   - Agent tools follow the **Model Context Protocol (MCP)** specification.
   - The tool server runs as an independent MCP service over standard I/O (`StdioServerTransport`) and connects to LangGraph via `@langchain/mcp-adapters`.

4. **Zero-Secret Codebase:**
   - Secrets, keys, and tokens are **never** hardcoded or committed. All configurations are parsed through centralized configuration objects with fallback guards.

---

## 2. Strict Backend Conventions

### 2.1 Pure ES Module (ESM) Requirement
The backend runs in native ESM mode (`"type": "module"` in `backend/package.json`).
- ✅ **ALWAYS** use `import` and `export` statements.
- ❌ **NEVER** use `require()` or `module.exports`.
- ✅ **ALWAYS** include explicit file extensions in relative imports:
  ```javascript
  import config from "./config/ENV.config.js"; // Correct
  import User from "../models/user.model.js";  // Correct
  ```
  *(Omitting `.js` will crash Node.js ESM resolution at runtime!)*

### 2.2 Route & Endpoint Namespaces
Do **NOT** invent alternative endpoint paths. Adhere to the established contract:

| Category | Route Prefix | Router File | Key Endpoints |
|---|---|---|---|
| **Auth** | `/api/auth` | `backend/src/routes/auth.route.js` | `/health`, `/login`, `/logout`, `/me` |
| **Agent CRUD** | `/api/agent` | `backend/src/routes/agent.route.js` | `/create`, `/all`, `/:id` (GET/DELETE) |
| **AI Orchestration** | `/api/ai` | `backend/src/routes/chat.route.js` | `/chat` (general graph), `/agent` (custom agent graph) |

*⚠️ Note: Notice that AI endpoints are under `/api/ai/`, **not** `/api/chat/`.*

### 2.3 LangGraph Implementation Standard
When modifying or extending `backend/src/services/graph/agent.graph.js`:
1. Use `MessagesAnnotation` as the graph state channel:
   ```javascript
   import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
   ```
2. Dynamic tools are retrieved from `getMcpTools()` and bound to the Groq LLM:
   ```javascript
   const llmWithTools = mcpTools.length > 0 ? llm.bindTools(mcpTools) : llm;
   ```
3. Thread checkpointing is mandatory:
   ```javascript
   const mongoClient = new MongoClient(config.MONGO_URL);
   const checkpointer = new MongoDBSaver({ client: mongoClient });
   return workFlow.compile({ checkpointer });
   ```
4. Always pass `configurable: { thread_id: String(req.user._id) }` when calling `.invoke()` to isolate conversational memory per user.

### 2.4 Human-in-the-Loop (HITL) Gate
Sensitive actions belong to the `SENSITIVE_TOOLS` set:
```javascript
const SENSITIVE_TOOLS = new Set([
  "send_email",
  "publish_instagram_image",
  "web_search", // Configurable per integration
]);
```
- In `routeAfterChat()`, check if `lastMessage.tool_calls` contains any sensitive tool.
- If true, route to `ActionApprovalNode` instead of executing automatically.

### 2.5 Database Connection Resilience (Serverless-Ready)
Mongoose connections in serverless environments can be called repeatedly.
- Always check `mongoose.connection.readyState >= 1` before calling `.connect()`.
- **NEVER** call `process.exit(1)` inside database handlers on connection drops, as this kills the serverless worker.

---

## 3. Strict Frontend Conventions

### 3.1 Path Aliases & Imports
The Vite build is configured with a root alias:
```javascript
"@" => path.resolve("./src")
```
- ✅ **ALWAYS** use `@/` for internal frontend imports:
  ```javascript
  import { Button } from "@/components/ui/button";
  import useAuth from "@/features/auth/hooks/useAuth";
  ```

### 3.2 Feature-Based Architecture
Group logic by domain under `frontend/src/features/`:
```
src/features/
├── auth/
│   ├── auth.api.js        # Axios network calls
│   ├── authSlice.js       # Redux state & reducers
│   └── hooks/useAuth.js   # Custom React hook exposing clean methods
├── agent/
│   ├── agents.api.js
│   ├── agentSlice.js
│   └── hooks/useAgent.js
└── chat/
    ├── chat.api.js
    ├── chatSlice.js
    └── hooks/useChat.js
```
- Components should consume custom hooks (e.g. `useChat()`, `useAuth()`, `useAgent()`), **not** raw Axios calls directly.

### 3.3 Centralized Axios Client
Network calls must use `@/api/axios.js`:
```javascript
import { create } from "axios";

const api = create({
  baseURL: import.meta.env.VITE_SERVER_URL || "/api",
  withCredentials: true, // Required for HTTP-Only auth cookies
});

export default api;
```
- **NEVER** use global `fetch` without `credentials: "include"`, or cookies will not be sent!

### 3.4 Styling & UI Primitives
- **Tailwind CSS v4:** Use modern utility classes with backdrop filters (`backdrop-blur-xl`, `bg-white/[0.04]`).
- **Icons:** Use `lucide-react` as the primary icon set.
- **Components:** Built using accessible primitives from `@base-ui/react` and `shadcn`.

---

## 4. MCP (Model Context Protocol) Implementation Rules

1. **Tool Definition:**
   Tools are defined in `backend/src/services/mcp/servers/server.js`:
   ```javascript
   server.registerTool(
     "tool_name",
     {
       description: "Clear explanation of tool purpose for LLM reasoning",
       inputSchema: z.object({ ... }),
     },
     async (args) => { ... }
   );
   ```
2. **Standard Output Schema:**
   MCP tool returns must adhere to the standard envelope:
   ```javascript
   return {
     content: [
       {
         type: "text",
         text: JSON.stringify(result) || result,
       },
     ],
   };
   ```

---

## 5. Deployment & Vercel Monorepo Rules

1. **Dependency Overrides:**
   Both `backend/package.json` and root `package.json` contain an `overrides` section:
   ```json
   "overrides": {
     "jwks-rsa": { "jose": "^4.15.9" }
   }
   ```
   **DO NOT DELETE THIS BLOCK.** It fixes a severe upstream ESM/CJS collision in `firebase-admin` that crashes Vercel serverless with `ERR_REQUIRE_ESM`.

2. **Routing Rules (`vercel.json`):**
   - API calls (`/api/*`) are handled by `backend/src/index.js` via `@vercel/node`.
   - Frontend static assets are built with `@vercel/static-build` using `frontend/package.json` and `distDir: "dist"`.
   - Client routes fallback to `/frontend/index.html`. Do not change this to non-existent paths.

---

## 6. Checklist Before Committing Changes

- [ ] Does the new backend file have `"type": "module"` compatibility and explicit `.js` import extensions?
- [ ] Are all API calls using the correct namespace (`/api/auth`, `/api/agent`, `/api/ai`)?
- [ ] If adding an AI tool, is it registered in the MCP Server or handled by the LangGraph ToolNode?
- [ ] Is conversational memory respecting the user's `thread_id`?
- [ ] Are all sensitive keys passed via `ENV.config.js` with placeholders in `.env.example`?
- [ ] Did you avoid introducing raw `console.log` statements with user secrets or access tokens?
