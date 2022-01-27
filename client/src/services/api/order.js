import axios from "../axios";

export const getAllOrders = async () =>
  (await axios.get("payment/orders")).data;

export const getOrderById = async (id) =>
  (await axios.get(`payment/order/${id}`)).data;

export const cancelOrder = async (id) =>
  (await axios.get(`payment/order/${id}/cancel`)).data;
