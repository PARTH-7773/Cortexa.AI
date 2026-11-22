import api from "@/api/axios";

const createAgentApi = async (credentials) => {
  return await api.post("/agent/create", credentials);
};

const getAllAgentApi = async () => {
  return await api.get("/agent/all");
};

const getAgentByIdApi = async (id) => {
  return await api.get(`/agent/${id}`);
};

const deleteAgentApi = async (id) => {
  return await api.delete(`/agent/${id}`);
};

export default {
  createAgentApi,
  getAllAgentApi,
  deleteAgentApi,
  getAgentByIdApi,
};
