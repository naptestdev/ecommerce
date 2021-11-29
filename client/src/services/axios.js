import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  headers: {
    authorization: localStorage.getItem("token"),
  },
});

export default instance;
