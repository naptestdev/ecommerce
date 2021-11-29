const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  _id: String,
  name: String,
  image: String,
});

module.exports = mongoose.model("categories", CategorySchema);
