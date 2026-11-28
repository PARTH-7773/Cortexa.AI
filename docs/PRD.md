# Product Requirements Document (PRD)

## Project Title: Cortexa — Automation AI Platform
**Document Version:** 1.0.0  
**Target Audience:** Engineering, Product, AI Research, and AI Coding Agents  
**Status:** Approved & Living Specification  

---

## 1. Executive Summary & Vision

**Cortexa (Automation AI)** is an enterprise-grade autonomous multi-agent orchestration workspace. It allows knowledge workers, developers, and operators to create, configure, and execute custom autonomous AI agents powered by state-of-the-art Large Language Models (LLMs), tool ecosystems adhering to the **Model Context Protocol (MCP)**, cyclic execution graphs via **LangGraph**, and multi-turn state persistence backed by **MongoDB**.

Unlike rigid, single-turn chatbot interfaces or brittle linear agent scripts, Cortexa implements:
1. **Dynamic Cyclic Reasoning:** Built on LangGraph state machines (`StateGraph`) that evaluate, plan, invoke tools, inspect outputs, and self-correct.
2. **Standardized Extensibility via MCP:** Uses Anthropic's Model Context Protocol to decouple agent logic from tool execution environments across standard I/O streams.
3. **Enterprise Guardrails & Human-in-the-Loop (HITL):** Sensitive actions (e.g. sending communications, deleting data, public publishing) require explicit human review and approval before execution.
4. **Persistent Thread Memory:** Conversation history, tool call outputs, and intermediate states persist in MongoDB checkpointer tables indexed per user thread.

---

## 2. Product Positioning & Scope

### 2.1 What Cortexa IS:
- A multi-agent creation studio where users define distinct agent personas, system prompts, domain knowledge bases, and authorized toolsets.
- An MCP-native runtime where tools (e.g., Tavily internet search, Gmail, Calendar, calculators) run as standardized services.
- A secure, multi-tenant web application featuring Google OAuth authentication, session cookie isolation, and per-user agent segregation.
- A high-speed inference application powered by Groq's LPU acceleration (e.g. `qwen/qwen3.8-27b`).

### 2.2 What Cortexa is NOT:
- Not a generic static LLM wrapper without tool access.
- Not a single-prompt pipeline; agents maintain stateful execution graphs with loopback capabilities.
- Not an unconstrained execution environment; agents cannot perform irreversible external side-effects without HITL validation.

---

## 3. User Personas & Core Use Cases

| Persona | Needs & Goals | Core Workflow |
|---|---|---|
| **Autonomous Researcher** | Conduct deep real-time research, verify facts, summarize literature. | Selects "Research Agent", prompts questions requiring live data; agent calls MCP Tavily search, parses results, synthesizes report. |
| **Workflow Operator** | Draft communications, organize tasks, coordinate schedules. | Requests email or calendar actions; agent generates draft parameters; triggers HITL approval card for operator sign-off before sending. |
| **Domain Creator** | Customize agents with specialized instructions and constrained tools. | Navigates to `/agent/new`, enters knowledge base guidelines, selects tools, and tests in the workspace chat. |

---

## 4. System Architecture & Technical Specifications

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    Frontend Layer                      │
                               │  React 19 • Vite • Tailwind CSS v4 • Redux Toolkit     │
                               └───────────────────────────┬────────────────────────────┘
                                                           │ (REST + Cookie Authentication)
                               ┌───────────────────────────▼────────────────────────────┐
                               │                     Backend API                        │
                               │         Express.js 5 • JWT Auth • Mongoose 9           │
                               └───┬───────────────────────┬────────────────────────┬───┘
                                   │                       │                        │
               ┌───────────────────▼──┐        ┌───────────▼──────────┐ ┌───────────▼──────────┐
               │    Auth Service      │        │    Agent Service     │ │      Chat Service    │
               │ Firebase Admin Verify│        │   Mongoose Model CRUD│ │ LangGraph Orchestrator│
               └──────────────────────┘        └──────────────────────┘ └───────────┬──────────┘
                                                                                    │
                                       ┌────────────────────────────────────────────┴─────────┐
                                       │              LangGraph State Machine                 │
                                       │                                                      │
                                       │   ┌──────────────┐             ┌─────────────────┐   │
                                       │   │  Chat Node   ├──toolCalls─►│    Route Gate   │   │
                                       │   │ (Groq LLM)   │◄──results───┤ (Sensitive Check│   │
                                       │   └──────┬───────┘             └────────┬────────┘   │
                                       │          │                              │            │
                                       │   __end__│             ┌────────────────┴────────┐   │
                                       │          ▼             ▼                         ▼   │
                                       │   ┌──────────────┐┌───────────────┐  ┌──────────────┐│
                                       │   │ Final Output ││  Tool Node    │  │HITL Approval ││
                                       │   └──────────────┘│ (MCP Adapter) │  │    Node      ││
                                       │                   └───────┬───────┘  └──────────────┘│
                                       └───────────────────────────┼──────────────────────────┘
                                                                   │
                                                 ┌─────────────────▼─────────────────┐
                                                 │       MCP Server (Stdio Transport)│
                                                 │   Tavily Search / Native Tools    │
                                                 └───────────────────────────────────┘
```

---

## 5. Functional Requirements & Feature Breakdown

### 5.1 Authentication & Session Management
- **Identity Provider:** Firebase Authentication (Google OAuth 2.0).
- **Client Flow:** User clicks "Login with Google", Firebase SDK completes popup sign-in, yields client ID token.
- **Backend Verification:** `POST /api/auth/login` receives the token, validates it using `firebase-admin`, and upserts user record into MongoDB.
- **Session Delivery:** Generates signed JWT stored in an HTTP-Only, SameSite cookie (`token`) with 3-day TTL.
- **Route Protection:** `auth.middleware.js` blocks unauthorized requests with `401 Unauthorized`.

### 5.2 Agent Management (CRUD)
- **Data Model:** Name (unique), KnowledgeBase (system prompt), Instructions (operational constraints), Tools (string array), Status (active/inactive).
- **Creation (`POST /api/agent/create`):** Validates required fields, prevents duplicate agent names per system, tags user ownership.
- **Retrieval (`GET /api/agent/all`, `GET /api/agent/:id`):** Scoped strictly to the authenticated `userId`.
- **Deletion (`DELETE /api/agent/:id`):** Soft or hard deletes user-owned agents.

### 5.3 Agentic Orchestration Engine (LangGraph)
- **Core Library:** `@langchain/langgraph` utilizing `StateGraph(MessagesAnnotation)`.
- **Inference Engine:** `@langchain/groq` using high-speed models (`qwen/qwen3.8-27b`).
- **Graph Topology:**
  - `__start__` ➔ `chatNode`
  - `chatNode` ➔ Conditional Edge `routeAfterChat`:
    - If no `tool_calls` exist ➔ `__end__`
    - If `tool_calls` contain sensitive tools (`send_email`, `publish_instagram_image`) ➔ `ActionApprovalNode`
    - If normal tools ➔ `toolNode`
  - `toolNode` ➔ Loops back to `chatNode` for answer synthesis.
  - `ActionApprovalNode` ➔ `toolNode` or `__end__` depending on approval resolution.

### 5.4 Model Context Protocol (MCP) Integration
- **Server Component:** `backend/src/services/mcp/servers/server.js` starts an MCP server using `@modelcontextprotocol/server` over `StdioServerTransport`.
- **Adapter Component:** `backend/src/services/mcp/mcp-adapter.js` attaches the sub-process using `@langchain/mcp-adapters`.
- **Current Live Tools:**
  - `web_search`: Powered by `@langchain/tavily` for live web data with depth and relevance scoring.
  - Extensible to calendar, database, and local file operations.

### 5.5 State & Thread Checkpointing
- **Storage:** MongoDB Checkpointer (`MongoDBSaver` from `@langchain/langgraph-checkpoint-mongodb`).
- **Memory Granularity:** Isolated per user `thread_id` (derived from `req.user._id`).
- **Benefits:** Agents remember facts across turns, retain intermediate calculations, and allow session resumption without context explosion.

### 5.6 Frontend Workspace & UX
- **Page Layouts:**
  - `/login`: Minimalist Google sign-in with brand identity.
  - `/`: Main interactive agent workspace featuring agent switcher, prompt bar, and chat stream.
  - `/agents`: Agent inventory and inspection cards.
  - `/agent/new`: Agent creation studio with live character counts, tool toggles, and validation.
  - `/integration`: Integrations dashboard for viewing active MCP endpoints and setting HITL toggles.
- **Design System:** Glassmorphism theme, dark background palette (`#121317` with radial ambient gradients), Tailwind CSS v4, and accessible shadcn primitives.

---

## 6. Data Contracts & API Schema

### 6.1 Authentication API (`/api/auth`)
- `POST /api/auth/login`
  - Input: `{ "token": string }`
  - Output: `{ "success": boolean, "user": UserObject }`
  - Sets Cookie: `token=<JWT>; HttpOnly; Path=/; Max-Age=259200`
- `GET /api/auth/me`
  - Output: `{ "success": true, "user": UserObject }`
- `GET /api/auth/logout`
  - Clears `token` cookie.

### 6.2 Agent API (`/api/agent`)
- `POST /api/agent/create`
  - Input:
    ```json
    {
      "name": "Research Analyst",
      "knowledgeBase": "You are an AI research assistant...",
      "instructions": "Search the web for up-to-date data...",
      "tools": ["web_search", "calculator"]
    }
    ```
- `GET /api/agent/all`
  - Output: `{ "success": true, "agent": [AgentObject] }`
- `GET /api/agent/:id`
  - Output: `{ "success": true, "agent": AgentObject }`
- `DELETE /api/agent/:id`
  - Output: `{ "success": true, "message": "Delete agent successfully" }`

### 6.3 AI & Chat Execution API (`/api/ai`)
- `POST /api/ai/chat` (General Conversational StateGraph)
  - Input: `{ "message": string }`
  - Output: `{ "success": true, "aiMessage": string }`
- `POST /api/ai/agent` (Configured Agent LangGraph with MCP)
  - Input: `{ "message": string, "agent": string }`
  - Output: `{ "success": true, "aiMessage": string }`

---

## 7. Non-Functional & Security Requirements

1. **Zero Secret Leakage:**
   - `.env`, `.env.local`, and `serviceAccountKey.json` must **NEVER** be committed to Git.
   - All secret configurations are injected via environment variables or Vercel Dashboard secrets.
2. **Resilient Cloud Runtime:**
   - Database connections reuse cached Mongoose connection promises across serverless cold starts.
   - Firebase Admin initializes dynamically from `FIREBASE_SERVICE_ACCOUNT` JSON string in cloud environments.
3. **CORS Governance:**
   - Dynamic CORS verification permitting `localhost`, local network dev addresses, and authorized production Vercel domains.
4. **Dependency Integrity:**
   - Fixed overrides for `jwks-rsa` (`3.2.2`) and `jose` (`4.15.9`) to prevent `ERR_REQUIRE_ESM` breaks in CommonJS/ESM boundaries.

---

## 8. Success Metrics & Future Roadmap

### Success Metrics
- Average turn latency < 2.5 seconds (via Groq LPU).
- Zero unauthorized tool calls bypassed past the HITL gate.
- 99.9% conversation state retention across turns via MongoDB checkpointer.

### Future Roadmap
- **Streaming Tokens:** Server-Sent Events (SSE) streaming for real-time token rendering.
- **Multi-Agent Collaboration:** Multi-agent supervisor patterns where agents hand tasks off to specialist sub-agents.
- **Rich HITL Cards:** Direct in-chat interactive forms to edit tool call parameters (e.g. email body, recipient) before dispatching.
