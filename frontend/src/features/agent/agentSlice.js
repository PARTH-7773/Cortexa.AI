import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  agents: [],
  selectedAgentId: null,
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

      // Keep selected agent if still present, Otherwise peek the first one
      const exists = list.some(
        (a) => (a._id || a.id) === state.selectedAgentId,
      );
      if (!exists) {
        state.selectedAgentId = list[0]._id || list[0].id || null;
      }
    },
    addAgent(state, action) {
      const created = action.payload;
      if (!created) return;
      state.agents.unshift(created);
      state.selectedAgentId =
        created._id || created.id || state.selectedAgentId;
      state.loading = false;
      state.error = null;
    },
    setSelectedAgentId(state, action) {
      state.selectedAgentId = action.payload;
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
        state.selectedAgentId =
          state.agents[0]?._id || state.agents[0]?.id || null;
      }
    },
    clearAgents(state, action) {
      state.agents = [];
      state.selectedAgentId = null;
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
