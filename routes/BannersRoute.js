const express = require("express");
const router = express.Router();
const BannersModel = require("../models/BannerModel");

router.get("/", async (req, res) => {
  try {
    const banners = await BannersModel.find();

    res.send(banners);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
