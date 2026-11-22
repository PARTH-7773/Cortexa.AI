import api from "@/api/axios";

const chatApi = async (message) => {
  return await api.post("/ai/chat", message);
};

export default {
  chatApi,
};
