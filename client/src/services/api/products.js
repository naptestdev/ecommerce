import axios from "../axios";

export const getCategories = async () =>
  (await axios.get("products/categories")).data;

export const getProducts = async (page = 0) =>
  (await axios.get("products", { params: { page } })).data;

export const getProductById = async (id) =>
  (await axios.get(`products/item/${id}`)).data;

export const updateProduct = async (id, body) =>
  (await axios.post(`products/update/${id}`, body)).data;

export const createProduct = async (body) =>
  (await axios.post("products/create", body)).data;

export const deleteProductById = async (id) =>
  (await axios.delete(`products/${id}`)).data;
