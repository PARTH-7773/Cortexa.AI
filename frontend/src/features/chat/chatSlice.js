import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [
    {
      role: "user",
      content: "hello",
    },
    {
      role: "assistant",
      content: "How can i help you today?",
    },
  ],
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
    clearSelectdAgent(state, action) {
      state.selectedAgent = null;
    },
    setActiveTreadId(state, action) {
      state.activeTreadId = action.payload;
    },
    setMessages(state) {
      state.messages = action.payload;
    },
    clearChat(state, action) {
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
  clearChat,
  clearChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
