const express = require("express");
const router = express.Router();
const ReviewsModel = require("../models/ReviewsModel");
const ProductModel = require("../models/ProductModel");
const { verifyJWT } = require("../controllers/verifyJWT");

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

      const existingProduct = await ProductModel.findOne({
        _id: req.params.product,
      });

      await existingProduct.update({
        ratings:
          (existingProduct.ratings * existingProduct.ratingsCount -
            existingReviews.ratings +
            req.body.ratings) /
          existingProduct.ratingsCount,
      });

      res.send(saved);
    } else {
      const created = await ReviewsModel.create({
        product: req.params.product,
        user: req.user._id,
        ratings: req.body.ratings,
        comment: req.body.comment,
      });

      const existingProduct = await ProductModel.findOne({
        _id: req.params.product,
      });

      await existingProduct.update({
        $inc: {
          ratingsCount: 1,
        },
        ratings:
          (existingProduct.ratings * existingProduct.ratingsCount +
            req.body.ratings) /
          (existingProduct.ratingsCount + 1),
      });
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
