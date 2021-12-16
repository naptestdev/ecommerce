const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  ratings: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("reviews", ReviewsSchema);
