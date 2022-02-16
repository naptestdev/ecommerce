import axios from "../shared/axios";

export const getAllUsers = async () => (await axios.get("users/all")).data;

export const deleteUser = async (id) =>
  (await axios.delete("users", { data: { _id: id } })).data;
