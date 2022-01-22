const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const CartModel = require("../models/CartModel");
const OrderModel = require("../models/OrderModel");
const crypto = require("crypto");
const axios = require("axios").default;

let checkoutSessions = {};

router.post("/create-session", verifyJWT, async (req, res) => {
  try {
    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;

    const existingCart = await CartModel.findOne({
      user: req.user._id,
    }).populate("products.product");

    if (!existingCart || existingCart.products?.length <= 0)
      return res.status(400).send({ message: "Cart is empty" });

    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const SECRET_KEY = process.env.MOMO_SECRET_KEY;
    const requestId = Math.random().toString(36).slice(-8);
    const orderId = requestId;
    const amount = `${Math.round(
      existingCart.products.reduce((prev, item) => {
        return (
          prev +
          Math.round(item.product.price - item.product.discount) * item.quantity
        );
      }, 0) * Number(process.env.CONVERSION_UNIT)
    )}`;
    const redirectUrl = `${serverBaseUrl}/api/payment/success`;
    const ipnUrl = "https://google.com";
    const requestType = "captureWallet";
    const orderInfo = "Thanh toán đơn hàng eCommerce";
    const extraData = "";

    const raw = {
      accessKey,
      amount,
      extraData,
      ipnUrl,
      orderId,
      orderInfo,
      partnerCode,
      redirectUrl,
      requestId,
      requestType,
    };

    const rawSignature = Object.keys(raw)
      .sort()
      .reduce((obj, key) => {
        obj[key] = raw[key];
        return obj;
      }, {});

    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(
        Object.entries(rawSignature)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")
      )
      .digest("hex");

    axios
      .post("https://test-payment.momo.vn/v2/gateway/api/create", {
        partnerCode,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData,
        lang: "en",
        signature,
      })
      .then((response) => {
        checkoutSessions[requestId] = req.user._id;

        res.send(response.data.payUrl);
      })
      .catch((err) => {
        res.status(500).send({ message: "Error", error: err.response.data });
      });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/success", async (req, res) => {
  try {
    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;

    if (req.query.resultCode !== "0")
      return res.redirect(
        process.env.NODE_ENV === "production"
          ? `${serverBaseUrl}/cart`
          : "http://localhost:3000/cart"
      );

    if (checkoutSessions[req.query.requestId]) {
      const userId = checkoutSessions[req.query.requestId];

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
      res.status(400).send({
        message: "Invalid Payment Id",
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
