import axios from "../shared/axios";

export const createReview = async (productId, ratings, comment) =>
  (await axios.post(`reviews/${productId}/create-review`, { ratings, comment }))
    .data;

export const getReviews = async (productId) =>
  (await axios.get(`reviews/${productId}`)).data;
