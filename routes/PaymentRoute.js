const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { verifyJWT } = require("../controllers/verifyJWT");
const CartModel = require("../models/CartModel");
const OrderModel = require("../models/OrderModel");

let checkoutSessions = {};

router.post("/create-session", verifyJWT, async (req, res) => {
  try {
    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;

    const existingCart = await CartModel.findOne({
      user: req.user._id,
    }).populate("products.product");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${serverBaseUrl}/api/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url:
        process.env.NODE_ENV === "production"
          ? `${serverBaseUrl}/cart`
          : "http://localhost:3000/cart",
      line_items: existingCart.products.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(
            (item.product.price - item.product.discount) * 100
          ),
        },
        quantity: item.quantity,
      })),
    });

    checkoutSessions[session.id] = req.user._id;

    res.send(session.url);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/success", async (req, res) => {
  try {
    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;

    if (checkoutSessions[req.query.sessionId]) {
      const userId = checkoutSessions[req.query.sessionId];

      const existingCart = await CartModel.findOne({ user: userId }).populate([
        "products.product",
        "user",
      ]);

      await OrderModel.create({
        user: userId,
        products: existingCart.products,
        amount: existingCart.products.reduce((acc, item) => {
          return (
            acc +
            Math.round((item.product.price - item.product.discount) * 10) / 10
          );
        }, 0),
        address: existingCart.user.address,
      });

      await CartModel.findOneAndDelete({ _id: existingCart._id });

      res.redirect(
        process.env.NODE_ENV === "production"
          ? `${serverBaseUrl}/orders`
          : "http://localhost:3000/orders"
      );
    } else {
      res.send({
        message: "Invalid Session Id",
      });
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/orders", verifyJWT, async (req, res) => {
  try {
    const existingOrders = await OrderModel.find({
      user: req.user._id,
    });

    res.send(existingOrders);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/order/:id", async (req, res) => {
  try {
    const existingOrder = await OrderModel.findOne({
      _id: req.params.id,
    });

    if (!existingOrder)
      return res.status(404).send({
        message: "Order not found",
      });

    res.send(existingOrder);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
