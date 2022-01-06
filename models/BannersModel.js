const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("banners", SlideSchema);
