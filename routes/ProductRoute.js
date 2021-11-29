const express = require("express");
const router = express.Router();
const ProductModel = require("../models/ProductModel");

router.get("/:id", async (req, res) => {
  try {
    const existingProduct = await ProductModel.findOne({ _id: req.params.id });

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
