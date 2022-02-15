const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const CartModel = require("../models/CartModel");
const OrderModel = require("../models/OrderModel");
const crypto = require("crypto");
const dayjs = require("dayjs");

let checkoutSessions = {};

router.post("/create-session", verifyJWT, async (req, res) => {
  try {
    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;

    const existingCart = await CartModel.findOne({
      user: req.user._id,
    }).populate("products.product");

    if (!existingCart || existingCart.products?.length <= 0)
      return res.status(400).send({ message: "Cart is empty" });

    const amount = existingCart.products.reduce((prev, item) => {
      return prev + item.product.price * item.quantity;
    }, 0);

    const paymentId = Date.now().toString(36).slice(-8);

    const params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMNCODE,
      vnp_Amount: Math.round(amount * 100),
      vnp_CreateDate: dayjs().format("YYYYMMDDHHmmss"),
      vnp_CurrCode: "VND",
      vnp_IpAddr: "127.0.0.1",
      vnp_Locale: "en",
      vnp_OrderInfo: `Thanh toán đơn hàng eCommerce`,
      vnp_ReturnUrl: `${serverBaseUrl}/api/payment/success`,
      vnp_TxnRef: paymentId,
    };

    const hash = crypto
      .createHmac("sha512", process.env.VNP_HASHSECRET)
      .update(
        Object.entries(
          Object.keys(params)
            .sort()
            .reduce((result, key) => {
              result[encodeURIComponent(key)] = encodeURIComponent(params[key])
                .split("%20")
                .join("+");
              return result;
            }, {})
        )
          .map(([item, value]) => `${item}=${value}`)
          .join("&")
      )
      .digest("hex");

    const url = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${Object.entries(
      { ...params, vnp_SecureHash: hash }
    )
      .map(([item, value]) => `${item}=${encodeURIComponent(value)}`)
      .join("&")}`;

    checkoutSessions[paymentId] = req.user._id;

    res.send(url);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/success", async (req, res) => {
  try {
    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;

    if (
      req.query.vnp_ResponseCode !== "00" &&
      req.query.vnp_ResponseCode !== "0"
    )
      return res.redirect(
        process.env.NODE_ENV === "production"
          ? `${serverBaseUrl}/cart`
          : "http://localhost:3000/cart"
      );

    if (checkoutSessions[req.query.vnp_TxnRef]) {
      const userId = checkoutSessions[req.query.vnp_TxnRef];

      const existingCart = await CartModel.findOne({ user: userId }).populate([
        "products.product",
        "user",
      ]);

      await OrderModel.create({
        user: userId,
        products: existingCart.products,
        amount: existingCart.products.reduce((acc, item) => {
          return acc + item.product.price;
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
    }).sort({ updatedAt: "desc" });

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

router.get("/order/:id/cancel", async (req, res) => {
  try {
    const existingOrder = await OrderModel.findOne({
      _id: req.params.id,
    });

    if (!existingOrder)
      return res.status(404).send({
        message: "Order not found",
      });

    if (existingOrder.status !== 0)
      return res.status(400).send({
        message: "Order is not in pending state",
      });

    await OrderModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        status: 3,
      }
    );

    res.send({
      message: "Order has been cancelled",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
