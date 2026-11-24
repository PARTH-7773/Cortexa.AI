import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  selectedAgent: null,
  activeTreadId: null,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedAgent(state, action) {
      state.selectedAgent = action.payload;
    },
    clearSelectdAgent(state) {
      state.selectedAgent = null;
    },
    setActiveTreadId(state, action) {
      state.activeTreadId = action.payload;
    },
    setMessages(state,action) {
      state.messages = action.payload;
    },
    setNewMessage(state,action){
      state.messages.push(action.payload)
    },
    clearChat(state) {
      state.messages = [];
      state.activeTreadId = null;
      state.error = null;
    },
    clearChatError(state) {
      state.error = null;
    },
  },
});

export const {
  setSelectedAgent,
  clearSelectdAgent,
  setActiveTreadId,
  setMessages,
  setNewMessage,
  clearChat,
  clearChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
