const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const OrderModel = require("../models/OrderModel");

router.get("/", verifyJWT, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    const skip = (page - 1) * size;

    const data = await OrderModel.find()
      .sort({ updatedAt: -1 })
      .limit(size)
      .skip(skip);

    const totalPage = Math.ceil((await OrderModel.countDocuments()) / size);

    if (page > totalPage)
      return res.status(400).send({
        page: null,
        totalPage,
        data: [],
      });

    res.send({
      page,
      totalPage,
      data,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/:id", verifyJWT, async (req, res) => {
  try {
    const existingOrder = await OrderModel.findOne({ _id: req.params.id });

    res.send(existingOrder);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/:id/:status", verifyJWT, async (req, res) => {
  try {
    const existingOrder = await OrderModel.findOne({ _id: req.params.id });

    if (!existingOrder)
      return res.status(404).send({ message: "Order not found" });

    const { status } = req.params;

    if (
      Number.isNaN(Number(status)) ||
      Number(status) < 0 ||
      Number(status) > 3
    )
      return res.status(400).send({ message: "Invalid status" });

    await OrderModel.findOneAndUpdate(
      { _id: req.params.id },
      { status: Number(status) }
    );

    res.send({
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
