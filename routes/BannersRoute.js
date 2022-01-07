const express = require("express");
const router = express.Router();
const BannersModel = require("../models/BannerModel");

router.get("/", async (req, res) => {
  try {
    const banners = (await BannersModel.find())[0].images;

    res.send(banners);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length <= 0)
      return res.status(400).send({
        message: "Invalid image list",
      });

    await BannersModel.findOneAndUpdate(
      {},
      {
        images: req.body,
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
