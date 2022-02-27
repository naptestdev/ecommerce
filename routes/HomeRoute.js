const express = require("express");
const router = express.Router();
const AuthModel = require("../models/AuthModel");
const OrderModel = require("../models/OrderModel");
const { verifyJWT } = require("../controllers/verifyJWT");

router.get("/total-sales", verifyJWT, async (req, res) => {
  try {
    const sum = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    res.send(sum[0] || { total: 0 });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/total-users", verifyJWT, async (req, res) => {
  try {
    const count = await AuthModel.count({});

    res.send({
      count,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/total-transactions", verifyJWT, async (req, res) => {
  try {
    const count = await OrderModel.count({});

    res.send({
      count,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/recent-users", verifyJWT, async (req, res) => {
  try {
    const recentUsers = await AuthModel.find().sort("createdAt").limit(5);

    res.send(recentUsers);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/recent-transactions", verifyJWT, async (req, res) => {
  try {
    const recentTransactions = await OrderModel.find()
      .sort("createdAt")
      .limit(5)
      .populate("user");

    res.send(recentTransactions);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
