const express = require("express");
const router = express.Router();
const ProductModel = require("../models/ProductModel");

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
      if (req.query.minPrice) priceFilter.$min = req.query.minPrice;
      if (req.query.maxPrice) priceFilter.$max = req.query.maxPrice;

      filter.price = priceFilter;
    }
    if (req.query.minRatings) {
      filter.ratings = {
        $min: req.query.minRatings,
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
    if (!res.headerSent) res.sendStatus(500);
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
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
