const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const AuthSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(8),
  },
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
  emailVerified: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("auths", AuthSchema);
