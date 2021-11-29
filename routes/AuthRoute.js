const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const AuthModel = require("../models/AuthModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

router.get("/verify/:id", async (req, res) => {
  try {
    const updated = await AuthModel.findOneAndUpdate(
      { _id: req.params._id },
      { emailVerified: true }
    );

    if (!updated) return res.status(404).send("Email not found");

    res.send("Your email has been verified!");
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/sign-up", async (req, res) => {
  try {
    let { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).send({ message: "Missing information" });

    const existingUser = await AuthModel.findOne({ email });

    if (existingUser)
      return res.status(400).send({
        errorSection: "email",
        message: "This email has already been in use",
      });

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const saved = await AuthModel.create({
      username,
      email,
      password,
      emailVerified: true,
      // set to false when in production
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      auth: {
        user: "postmaster@sandboxc67925eb5432489498f3e5f02f80b520.mailgun.org",
        pass: "8766920602f4bd3bd01ef192d7ee2f6e-7dcc6512-e6da5d95",
      },
    });

    const mailOptions = {
      from: "E-Commerce Service <postmaster@sandboxc67925eb5432489498f3e5f02f80b520.mailgun.org>",
      to: email,
      subject: "Verify your email for E-Commerce",
      html: `<h1>Hello ${username}, Click this link to verify your email <a href="${
        req.protocol + "://" + req.get("host") + "/auth/verify/" + saved.id
      }" target="_blank">Verify</a></h1>`,
      text: `Hello ${username}, Click this link to verify your email ${
        req.protocol + "://" + req.get("host") + "/auth/verify/" + saved.id
      }`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send({
          user: saved,
          emailSent: { success: false, error },
        });
      } else {
        res.send({
          user: saved,
          emailSent: { success: true, info },
        });
      }
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

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

    if (!existingUser.emailVerified)
      return res.status(400).send({
        errorSection: "email",
        message: "Your email hasn't been verified",
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
  const existingUser = await AuthModel.findOne({ email: req.user.email });

  if (existingUser._id !== req.user._id)
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
});

module.exports = router;
