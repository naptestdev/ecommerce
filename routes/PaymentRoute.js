const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { verifyJWT } = require("../controllers/verifyJWT");
const CartModel = require("../models/CartModel");

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
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      })),
    });

    checkoutSessions[session.id] = req.user._id;

    res.send(session.url);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

router.get("/success", (req, res) => {
  try {
    if (checkoutSessions[req.query.sessionId]) {
      res.send(checkoutSessions[req.query.sessionId]);
    } else {
      res.send({
        message: "Invalid Session Id",
      });
    }
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
