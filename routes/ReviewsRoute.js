const express = require("express");
const router = express.Router();
const ReviewsModel = require("../models/ReviewsModel");
const ProductModel = require("../models/ProductModel");
const { verifyJWT } = require("../controllers/verifyJWT");

const updateRatingsStatus = async (productId) => {
  const average = (
    await ReviewsModel.aggregate([
      { $group: { _id: "$product", average: { $avg: "$ratings" } } },
    ])
  ).find((item) => item._id.toString() === productId).average;

  const ratingsCount = await ReviewsModel.count({ product: productId });

  await ProductModel.findOneAndUpdate(
    { _id: productId },
    { ratings: average, ratingsCount }
  );
};

router.post("/:product/create-review", verifyJWT, async (req, res) => {
  try {
    const existingReviews = await ReviewsModel.findOne({
      product: req.params.product,
      user: req.user._id,
    });

    if (existingReviews) {
      const saved = await ReviewsModel.findOneAndUpdate(
        {
          product: req.params.product,
          user: req.user._id,
        },
        {
          ratings: req.body.ratings,
          comment: req.body.comment,
        }
      );

      await updateRatingsStatus(req.params.product);

      res.send(saved);
    } else {
      const created = await ReviewsModel.create({
        product: req.params.product,
        user: req.user._id,
        ratings: req.body.ratings,
        comment: req.body.comment,
      });

      await updateRatingsStatus(req.params.product);

      res.send(created);
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
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
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
