const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema({
  images: [String],
});

module.exports = mongoose.model("banners", SlideSchema);
