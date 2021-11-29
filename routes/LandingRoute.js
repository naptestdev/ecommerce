const express = require("express");
const router = express.Router();

const SlideModel = require("../models/SlideModel");
const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");

router.get("/slide", async (req, res) => {
  try {
    const data = await SlideModel.find({});

    res.send(data);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const data = await CategoryModel.find({});

    res.send(data);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

router.get("/suggested", async (req, res) => {
  try {
    const data = await ProductModel.find({}).limit(30);

    res.send(data);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
