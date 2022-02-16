const express = require("express");
const CategoryModel = require("../models/CategoryModel");
const router = express.Router();
const ProductModel = require("../models/ProductModel");

const { verifyJWT } = require("../controllers/verifyJWT");

router.get("/", verifyJWT, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    const skip = (page - 1) * size;

    const data = await ProductModel.find()
      .sort({ updatedAt: -1 })
      .limit(size)
      .skip(skip);

    const totalPage = Math.ceil((await ProductModel.countDocuments()) / size);

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

router.get("/categories", verifyJWT, async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.send(categories);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/item/:id", verifyJWT, async (req, res) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });

    if (!product) return res.status(404).send({ message: "No product foun" });

    res.send(product);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/update/:id", verifyJWT, async (req, res) => {
  try {
    const { name, description, price, discount, stock, category, images } =
      req.body;

    const updateObj = {
      name,
      description,
      price: price - discount,
      originalPrice: price,
      stock,
      category,
      images,
    };

    await ProductModel.findOneAndUpdate({ _id: req.params.id }, updateObj);

    res.send({ message: "Product update successfully" });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/create", verifyJWT, async (req, res) => {
  try {
    const { name, description, price, discount, stock, category, images } =
      req.body;

    const createObj = {
      name,
      description,
      price: price - discount,
      originalPrice: price,
      stock,
      category,
      images,
      sold: 0,
      ratings: 0,
      ratingsCount: 0,
    };

    await ProductModel.create(createObj);

    res.send({ message: "Product created successfully" });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    await ProductModel.findOneAndDelete({ _id: req.params.id });

    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
