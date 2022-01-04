const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const AuthModel = require("../models/AuthModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/sign-in", async (req, res) => {
  try {
    const existingUser = await AuthModel.findOne({ email: req.body.email });

    if (!existingUser)
      return res.status(404).send({
        errorSection: "email",
        message: "The email provided isn't connected to any account",
      });

    let passwordCompare = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!passwordCompare)
      return res.status(400).send({
        errorSection: "password",
        message: "Password is incorrect",
      });

    if (!existingUser.isAdmin)
      return res.status(400).send({
        errorSection: "email",
        message: "This user is not an admin",
      });

    const user = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
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
    const existingUser = await AuthModel.findOne({ email: req.user.email });

    if (existingUser?._id?.toString() !== req.user?._id)
      return res.status(403).send({
        message: "Invalid user info",
      });

    const user = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
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
