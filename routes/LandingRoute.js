const express = require("express");
const router = express.Router();

const BannersModel = require("../models/BannersModel");
const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");

router.get("/slide", async (req, res) => {
  try {
    const data = (await BannersModel.find({}))[0].images;

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
