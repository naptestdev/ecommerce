const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("users", AuthSchema);
