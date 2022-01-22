const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const AuthModel = require("../models/AuthModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const emailVerificationTemplate = require("../views/EmailVerification");
const path = require("path");

const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

router.get("/verify/:id", async (req, res) => {
  try {
    const updated = await AuthModel.findOneAndUpdate(
      { _id: req.params.id },
      { emailVerified: true }
    );

    if (!updated) return res.status(404).send("Email not found");

    res.sendFile(path.resolve(__dirname, "..", "views", "EmailVerified.html"));
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
      emailVerified: false,
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verify/${
      saved.id
    }`;

    const mailOptions = {
      from: `E-Commerce Service <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify your email for E-Commerce",
      html: emailVerificationTemplate(username, verifyUrl),
      text: `Hello ${username}, Click this link to verify your email: ${verifyUrl}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);

        await AuthModel.findOneAndDelete({ email });

        res.status(500).send({
          errorSection: "email",
          message: "We can't send verification email. Please try again later",
        });
      } else {
        res.send({
          user: saved,
          emailSent: info,
        });
      }
    });
  } catch (error) {
    console.log(error);
    await AuthModel.findOneAndDelete({ email: req.body.email });

    if (!res.headersSent)
      res.status(500).send({
        errorSection: "email",
        message: "Something went wrong",
      });
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
      address: existingUser.address,
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
      address: existingUser.address,
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
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/update-username", verifyJWT, async (req, res) => {
  try {
    const existingUser = await AuthModel.findOne({ _id: req.user._id });

    if (!existingUser || !req.body.username)
      return res.status(403).send({
        message: "Invalid request",
      });

    await AuthModel.updateOne(
      { _id: req.user._id },
      { username: req.body.username }
    );

    res.send({
      message: "Username updated successfully",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/update-address", verifyJWT, async (req, res) => {
  try {
    const { fullName, phoneNumber, city, district, exactAddress } = req.body;

    if (!fullName || !phoneNumber || !city || !district || !exactAddress)
      return res.status(403).send({ message: "Missing info" });

    await AuthModel.findOneAndUpdate(
      { _id: req.user._id },
      { address: { fullName, phoneNumber, city, district, exactAddress } }
    );
    res.send({ message: "Address updated successfully!" });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/change-password", verifyJWT, async (req, res) => {
  try {
    const existingUser = await AuthModel.findOne({ _id: req.user._id });

    const { oldPassword, newPassword } = req.body;

    let passwordCompare = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );

    if (!passwordCompare)
      return res.status(403).send({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await AuthModel.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        password: hashed,
      }
    );

    res.send({
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
