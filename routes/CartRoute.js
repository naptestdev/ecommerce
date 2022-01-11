const express = require("express");
const { verifyJWT } = require("../controllers/verifyJWT");
const CartModel = require("../models/CartModel");

const router = express.Router();

router.get("/", verifyJWT, async (req, res) => {
  try {
    const existingCart = await CartModel.findOne({
      user: req.user._id,
    }).populate("products.product");

    if (!existingCart) return res.send([]);

    res.send(existingCart.products);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/update", verifyJWT, async (req, res) => {
  try {
    const existingCart = await CartModel.findOne({
      user: req.user._id,
    });

    if (existingCart) {
      const response = await CartModel.findOneAndUpdate(
        { user: req.user._id },
        {
          products: req.body.cart,
        }
      );

      res.send(response);
    } else {
      const response = await CartModel.create({
        user: req.user._id,
        products: req.body.cart,
      });

      res.send(response);
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
