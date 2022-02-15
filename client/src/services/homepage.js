import axios from "../shared/axios";

export const getCarousel = async () => (await axios.get("/landing/slide")).data;
export const getCategories = async () =>
  (await axios.get("/landing/categories")).data;

export const getSuggested = async () =>
  (await axios.get("landing/suggested")).data;
