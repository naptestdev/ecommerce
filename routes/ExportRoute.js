const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const convertCsvToXlsx = require("@aternus/csv-to-xlsx");

const AuthModel = require("../models/AuthModel");
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");

const { jsonToCSV } = require("../utils/utils");
const { verifyDownloadJWT } = require("../controllers/verifyJWT");

const handlers = {
  users: {
    formatted: async () => {
      const allUsers = await AuthModel.find();

      return allUsers.map((user) => ({
        _id: user._id.toString(),
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
    },
    original: async () => {
      const allUsers = await AuthModel.find();
      return allUsers.map((user) => ({
        _id: user._id.toString(),
        email: user.email,
        password: user.password,
        username: user.username,
        emailVerified: user.emailVerified,
        address: user.address || {},
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }));
    },
  },

  products: {
    formatted: async () => {
      const allProducts = await ProductModel.find();

      return allProducts.map((product) => ({
        _id: product._id.toString(),
        name: product.name,
        category: product.category,
        images: product.images,
        description: product.description,
        price: product.price,
        stock: product.stock,
        sold: product.sold || 0,
        ratings: product.ratings,
        ratingsCount: product.ratingsCount,
        discount: product.discount,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));
    },
    original: async () => {
      const allProducts = await ProductModel.find();

      return allProducts.map((product) => ({
        _id: product._id.toString(),
        name: product.name,
        category: product.category,
        images: product.images,
        description: product.description,
        price: product.price,
        stock: product.stock,
        sold: product.sold || 0,
        ratings: product.ratings,
        ratingsCount: product.ratingsCount,
        discount: product.discount,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));
    },
  },

  orders: {
    formatted: async () => {
      const allOrders = await OrderModel.find();

      return allOrders.map((order) => ({
        _id: order._id.toString(),
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
    },
    original: async () => {
      const allOrders = await OrderModel.find();

      return allOrders.map((order) => ({
        _id: order._id.toString(),
        user: order.user,
        products: order.products.map((product) => product._id.toString()),
        amount: order.amount,
        address: order.address || {},
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      }));
    },
  },
};

router.get("/base-url", (req, res) => {
  res.send(`${req.protocol}://${req.get("host")}/api/export`);
});

router.get("/:type/:filetype", verifyDownloadJWT, async (req, res) => {
  try {
    const { type, filetype } = req.params;

    if (
      !["users", "products", "orders"].includes(type) ||
      !["csv", "xlsx", "json"].includes(filetype)
    )
      return res.sendStatus(400);

    res.contentType(filetype);
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${type}.${filetype}`
    );

    if (filetype === "json") {
      const json = await handlers[type].original();
      res.send(JSON.stringify(json, null, 2));
    } else if (filetype === "csv") {
      const csv = jsonToCSV(await handlers[type].formatted());
      res.send(csv);
    } else if (filetype === "xlsx") {
      const csv = jsonToCSV(await handlers[type].formatted());

      fs.mkdirSync("exports", { recursive: true });

      const inputPath = path.resolve(__dirname, "..", "exports", `${type}.csv`);
      const outputPath = path.resolve(
        __dirname,
        "..",
        "exports",
        `${type}.xlsx`
      );

      fs.writeFileSync(inputPath, csv, {
        encoding: "utf-8",
      });

      convertCsvToXlsx(inputPath, outputPath);

      res.sendFile(outputPath);
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

// router.get("/orders/:type", verifyDownloadJWT, async (req, res) => {
//   try {
//     const formatted = await formatOrders();
//     const csv = jsonToCSV(formatted);
//     res.contentType("csv");
// res.setHeader("Content-disposition", "attachment; filename=orders.csv");
//     res.send(csv);
//   } catch (error) {
//     console.log(error);
//     if (!res.headersSent) res.sendStatus(500);
//   }
// });

module.exports = router;
