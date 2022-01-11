const express = require("express");
const router = express.Router();
const AuthModel = require("../models/AuthModel");
const { verifyJWT } = require("../controllers/verifyJWT");

router.get("/all", verifyJWT, async (req, res) => {
  try {
    const data = await AuthModel.find().sort("createdAt");

    res.send(data);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.delete("/", verifyJWT, async (req, res) => {
  try {
    await AuthModel.findOneAndDelete({ _id: req.body._id });

    res.send({
      message: "User has been deleted",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
