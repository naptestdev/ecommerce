import axios from "../axios";

export const getProductDetail = async (id) =>
  (await axios.get(`/product/${id}`)).data;

export const searchProduct = async (
  query = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  minRatings = ""
) =>
  (
    await axios.get("/product/search", {
      params: {
        q: query,
        category,
        minPrice,
        maxPrice,
        minRatings,
      },
    })
  ).data;

export const getCategory = async (categoryId) =>
  (await axios.get(`/product/search?category=${categoryId}&q=`)).data;

export const getSimilarProducts = async (productId) =>
  (await axios.get(`/product/similar/${productId}`)).data;
