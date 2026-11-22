import api from "@/api/axios";

const loginApi = async (credentials) => {
  return await api.post("/auth/login", credentials);
};

const logoutApi = async () => {
  return await api.get("/auth/logout");
};

const getMeApi = async () => {
  return await api.get("/auth/me");
};

export default { loginApi, logoutApi, getMeApi };
