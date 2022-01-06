const express = require("express");
const router = express.Router();
const AuthModel = require("../models/AuthModel");
const { verifyJWT } = require("../controllers/verifyJWT");

router.get("/recent-users", verifyJWT, async (req, res) => {
  try {
    const recentUsers = await AuthModel.find().sort("createdAt").limit(5);

    res.send(recentUsers);
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
