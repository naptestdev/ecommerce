import axios from "../axios";

export const getProductDetail = async (id) =>
  (await axios.get(`/product/${id}`)).data;
