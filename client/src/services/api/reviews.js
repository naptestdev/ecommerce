import axios from "../axios";

export const createReview = async (productId, ratings, comment) =>
  (await axios.post(`reviews/${productId}/create-review`, { ratings, comment }))
    .data;
