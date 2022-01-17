const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    products: [
      {
        product: Object,
        quantity: Number,
      },
    ],
    amount: Number,
    address: Object,
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderSchema);
