import axios from "../axios";

export const getCart = async () => (await axios.get("/cart")).data;
export const updateCart = async (cartData) =>
  (await axios.post("/cart/update", { cart: cartData })).data;
