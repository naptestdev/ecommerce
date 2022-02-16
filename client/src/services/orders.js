import axios from "../shared/axios";

export const getOrders = async (page = 0) =>
  (await axios.get("orders", { params: { page } })).data;

export const getOrderById = async (id) =>
  (await axios.get(`orders/${id}`)).data;

export const updateOrderStatus = async (id, status) =>
  (await axios.get(`orders/${id}/${status}`)).data;
