import axios from "../axios";

export const getRecentUsers = async () =>
  (await axios.get("home/recent-users")).data;
