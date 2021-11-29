const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  _id: String,
  category: String,
  image: Array,
  description: String,
  name: String,
  color: String,
  price: Number,
  stock: Number,
  sales: Number,
  ratings: Number,
  updatedAt: String,
});

module.exports = mongoose.model("products", ProductSchema);
