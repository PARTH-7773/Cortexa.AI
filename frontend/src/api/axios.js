import { create } from "axios";

const api = create({
    baseURL:import.meta.env.VITE_SERVER_URL ,
    withCredentials:true
})

export default api;
