const express = require("express");
const router = express.Router();
const ProductModel = require("../models/ProductModel");
const ReviewsModel = require("../models/ReviewsModel");

router.get("/search", async (req, res) => {
  try {
    let filter = {};

    if (req.query.q) {
      filter.$text = {
        $search: req.query.q,
      };
      filter.score = { $meta: "textScore" };
    }
    if (req.query.category)
      filter.category = { $in: req.query.category.split(",") };
    if (req.query.minPrice || req.query.maxPrice) {
      let priceFilter = {};
      if (req.query.minPrice) priceFilter.$gt = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lt = Number(req.query.maxPrice);

      filter.price = priceFilter;
    }
    if (req.query.minRatings) {
      filter.ratings = {
        $gt: Number(req.query.minRatings),
      };
    }

    let response;
    if (req.query.q)
      response = await ProductModel.find(filter).sort({
        score: { $meta: "textScore" },
      });
    else response = await ProductModel.find(filter);

    res.send(response);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/similar/:id", async (req, res) => {
  try {
    const existingProduct = await ProductModel.findOne({
      _id: req.params.id,
    });

    const category = existingProduct.category;

    const similar = await ProductModel.find({
      category,
      _id: { $ne: existingProduct._id },
    }).limit(10);

    const others = await ProductModel.find({
      _id: { $nin: similar.map((item) => item._id) },
    });

    const result = [...similar, ...others].slice(0, 10);

    res.send(result);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const existingProduct = await ProductModel.findOne({
      _id: req.params.id,
    }).populate("category");

    if (!existingProduct)
      return res.status(404).send({
        message: "Product not found",
      });

    res.send(existingProduct);

    const average =
      (
        await ReviewsModel.aggregate([
          { $group: { _id: "$product", average: { $avg: "$ratings" } } },
        ])
      ).find((item) => item._id.toString() === req.params.id)?.average || 0;

    const ratingsCount = await ReviewsModel.count({ product: req.params.id });

    await ProductModel.findOneAndUpdate(
      { _id: req.params.id },
      { ratings: average, ratingsCount }
    );
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
