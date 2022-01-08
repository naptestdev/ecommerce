const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const AdminModel = require("../models/AdminModel");
const jwt = require("jsonwebtoken");

router.post("/sign-in", async (req, res) => {
  try {
    const existingUser = await AdminModel.findOne({
      username: req.body.username,
    });

    if (!existingUser)
      return res.status(404).send({
        errorSection: "username",
        message: "The username provided isn't connected to any account",
      });

    if (req.body.password !== existingUser.password)
      return res.status(400).send({
        errorSection: "password",
        message: "Password is incorrect",
      });

    const user = {
      _id: existingUser._id,
      username: existingUser.username,
    };

    const accessToken = jwt.sign(user, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "7d",
    });

    res.send({ token: accessToken, user });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/verify-token", verifyJWT, async (req, res) => {
  try {
    const existingUser = await AdminModel.findOne({
      username: req.user.username,
    });

    if (existingUser?._id?.toString() !== req.user?._id)
      return res.status(403).send({
        message: "Invalid user info",
      });

    const user = {
      _id: existingUser._id,
      username: existingUser.username,
    };

    const accessToken = jwt.sign(user, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "7d",
    });

    res.send({
      user,
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    if (!res.headerSent) res.sendStatus(500);
  }
});

module.exports = router;
