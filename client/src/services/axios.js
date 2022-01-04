import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: localStorage.getItem("admin-token"),
  },
});

export default instance;
