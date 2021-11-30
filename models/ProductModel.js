const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  category: {
    type: String,
    ref: "categories",
  },
  image: Array,
  description: String,
  name: String,
  color: Array,
  price: Number,
  stock: Number,
  ratings: Number,
  discount: Number,
});

ProductSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("products", ProductSchema);
