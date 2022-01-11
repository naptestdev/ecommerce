const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      ref: "categories",
    },
    images: Array,
    description: String,
    name: String,
    price: Number,
    stock: Number,
    sold: Number,
    ratings: Number,
    ratingsCount: Number,
    discount: Number,
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("products", ProductSchema);
