import api from "@/api/axios";

const chatApi = async (message) => {
  return await api.post("/ai/chat", message);
};

const agentChatApi = async (message) => {
  return await api.post("/ai/agent", message);
};

export default {
  chatApi,
  agentChatApi,
};
