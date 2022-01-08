const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admins", AdminSchema);
