const express = require("express");
const router = express.Router();
const ReviewsModel = require("../models/ReviewsModel");
const { verifyJWT } = require("../controllers/verifyJWT");

router.post("/:product/create-review", verifyJWT, async (req, res) => {
  try {
    const existingReviews = await ReviewsModel.findOne({
      product: req.params.product,
      user: req.user._id,
    });

    if (existingReviews) {
      const saved = await existingReviews.update(req.body);
      res.send(saved);
    } else {
      const created = await ReviewsModel.create({
        product: req.params.product,
        user: req.user._id,
        ...req.body,
      });
      res.send(created);
    }
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

router.get("/:product", async (req, res) => {
  try {
    const existingReviews = await ReviewsModel.find({
      product: req.params.product,
    })
      .populate("user")
      .populate("product");

    res.send(existingReviews);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
