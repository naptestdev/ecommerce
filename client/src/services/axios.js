import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("admin-token");
  return config;
});

export default instance;
