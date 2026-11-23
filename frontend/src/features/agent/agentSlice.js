import { createSlice } from "@reduxjs/toolkit";

const SELECTED_AGENT_STORAGE_KEY = "cortexa_selected_agent_id";

function readStoredAgentId() {
  try {
    return localStorage.getItem(SELECTED_AGENT_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function writeStoredAgentId(id) {
  try {
    if (id) {
      localStorage.setItem(SELECTED_AGENT_STORAGE_KEY, String(id));
    } else {
      localStorage.removeItem(SELECTED_AGENT_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors (e.g., private browsing mode)
  }
}

const initialState = {
  agents: [],
  selectedAgentId: readStoredAgentId(),
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setAgentLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
    setAgentError(state, action) {
      state.error = action.payload || null;
      state.loading = false;
    },
    setAgents(state, action) {
      const list = Array.isArray(action.payload) ? action.payload : [];
      state.agents = list;
      state.loading = false;
      state.error = null;

      if (list.length === 0) {
        state.selectedAgentId = null;
        writeStoredAgentId(null);
        return;
      }

      // Keep stored/selected agent if still present; otherwise pick the first one
      const exists = list.some(
        (a) => String(a._id || a.id) === String(state.selectedAgentId),
      );
      if (!exists) {
        const fallbackId = list[0]._id || list[0].id || null;
        state.selectedAgentId = fallbackId;
        writeStoredAgentId(fallbackId);
      }
    },
    addAgent(state, action) {
      const created = action.payload;
      if (!created) return;
      state.agents.unshift(created);
      const nextId = created._id || created.id || state.selectedAgentId;
      state.selectedAgentId = nextId;
      writeStoredAgentId(nextId);
      state.loading = false;
      state.error = null;
    },
    setSelectedAgentId(state, action) {
      const nextId = action.payload || null;
      state.selectedAgentId = nextId;
      writeStoredAgentId(nextId);
    },
    removeAgent(state, action) {
      const targetId =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?._id || action.payload?.id;

      if (!targetId) return;

      state.agents = state.agents.filter(
        (agent) => (agent?._id || agent?.id) !== targetId,
      );

      if (state.selectedAgentId === targetId) {
        const fallbackId = state.agents[0]?._id || state.agents[0]?.id || null;
        state.selectedAgentId = fallbackId;
        writeStoredAgentId(fallbackId);
      }
    },
    clearAgents(state) {
      state.agents = [];
      state.selectedAgentId = null;
      writeStoredAgentId(null);
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setAgentLoading,
  setAgentError,
  setAgents,
  addAgent,
  setSelectedAgentId,
  removeAgent,
  clearAgents,
} = agentSlice.actions;

export default agentSlice.reducer;
