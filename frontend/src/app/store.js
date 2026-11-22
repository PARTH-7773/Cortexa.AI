import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import agentReducer from "@/features/agent/agentSlice";
import chatReducer from "@/features/chat/chatSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    agent: agentReducer,
    chat: chatReducer,
  },
});

export default store;
