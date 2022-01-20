const express = require("express");
const router = express.Router();

const AuthModel = require("../models/AuthModel");
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");

const { jsonToCSV } = require("../utils/utils");
const { verifyDownloadJWT } = require("../controllers/verifyJWT");

router.get("/base-url", (req, res) => {
  res.send(`${req.protocol}://${req.get("host")}/api/export`);
});

router.get("/users", verifyDownloadJWT, async (req, res) => {
  try {
    const allUsers = await AuthModel.find();

    const formatted = allUsers.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      username: user.username,
      emailVerified: user.emailVerified,
      "address.fullName": user.address?.fullName || "",
      "address.phoneNumber": user.address?.phoneNumber || "",
      "address.city": user.address?.city || "",
      "address.district": user.address?.district || "",
      "address.exactAddress": user.address?.exactAddress || "",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    const csv = jsonToCSV(formatted);

    res.contentType("csv");

    res.setHeader("Content-disposition", "attachment; filename=users.csv");

    res.send(csv);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/products", verifyDownloadJWT, async (req, res) => {
  try {
    const allProducts = (await ProductModel.find()).map((item) =>
      item.toObject()
    );

    const formatted = allProducts.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      images: product.images,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
      ratings: product.ratings,
      ratingsCount: product.ratingsCount,
      discount: product.discount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    const csv = jsonToCSV(formatted);

    res.contentType("csv");

    res.setHeader("Content-disposition", "attachment; filename=products.csv");

    res.send(csv);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/orders", verifyDownloadJWT, async (req, res) => {
  try {
    const allOrders = await OrderModel.find().lean();

    const formatted = allOrders.map((order) => ({
      id: order._id.toString(),
      user: order.user,
      products: order.products.map((product) => product._id.toString()),
      amount: order.amount,
      "address.fullName": order.address.fullName,
      "address.phoneNumber": order.address.phoneNumber,
      "address.city": order.address.city,
      "address.district": order.address.district,
      "address.exactAddress": order.address.exactAddress,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    const csv = jsonToCSV(formatted);

    res.contentType("csv");

    res.setHeader("Content-disposition", "attachment; filename=orders.csv");

    res.send(csv);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
