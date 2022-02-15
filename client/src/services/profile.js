import axios from "../shared/axios";

export const updateUsername = async (username) =>
  (await axios.post("auth/update-username", { username })).data;

export const updateAddress = async (body) =>
  (await axios.post("auth/update-address", body)).data;

export const changePassword = async (oldPassword, newPassword) =>
  (await axios.post("auth/change-password", { oldPassword, newPassword })).data;
