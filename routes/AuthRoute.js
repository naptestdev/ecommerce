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
        message: "Email đã được sử dụng",
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
      subject: "Xác nhận email của bạn cho eCommerce",
      html: emailVerificationTemplate(username, verifyUrl),
      text: `Xin chào ${username}, Hãy vào liên kết này để xác nhận email của bạn: ${verifyUrl}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);

        await AuthModel.findOneAndDelete({ email });

        res.status(500).send({
          errorSection: "email",
          message: "Có lỗi trong việc gửi email xác nhận",
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
        message: "Đã có lỗi xảy ra",
      });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const existingUser = await AuthModel.findOne({ email: req.body.email });

    if (!existingUser)
      return res.status(404).send({
        errorSection: "email",
        message: "Không tìm thấy email",
      });

    let passwordCompare = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!passwordCompare)
      return res.status(400).send({
        errorSection: "password",
        message: "Mật khẩu không đúng",
      });

    if (!existingUser.emailVerified)
      return res.status(400).send({
        errorSection: "email",
        message: "Email chưa được xác nhận",
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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) res.status(400).send({ message: "Email chưa được cung cấp" });

    const existingUser = await AuthModel.findOne({ email });

    if (!existingUser)
      return res.status(400).send({
        message: "Email không tồn tại",
      });

    const secret = existingUser.password + process.env.JWT_SECRET_TOKEN;
    const payload = {
      id: existingUser._id,
      email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    const forgotPassURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password?email=${email}&token=${token}`;

    res.sendStatus(200);

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

    const mailOptions = {
      from: `E-Commerce Service <${process.env.EMAIL}>`,
      to: email,
      subject: "Khôi phục mật khẩu của bạn cho E-Commerce",
      html: `Xin chào ${existingUser.username}. Hãy vào liên kết này để khôi phục mật khẩu của bạn: <a href="${forgotPassURL}" target="_blank">Khôi phục</a> (Liên kết có hiệu lực trong 15 phút)`,
      text: `Xin chào ${existingUser.username}. Hãy vào liên kết này để khôi phục mật khẩu của bạn: ${forgotPassURL} (Liên kết có hiệu lực trong 15 phút)`,
    };

    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/reset-password", async (req, res) => {
  try {
    const { email, token } = req.query;
    if (!email || !token) return res.sendStatus(400);

    const existingUser = await AuthModel.findOne({ email });

    if (!existingUser) return res.status(400).send("Email không tồn tại");

    const secret = existingUser.password + process.env.JWT_SECRET_TOKEN;

    try {
      jwt.verify(token, secret);
    } catch (error) {
      res.status(400).send("Token không hợp lệ");
    }

    res.sendFile(path.resolve(__dirname, "..", "views", "ResetPassword.html"));
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, token } = req.query;
    const { password } = req.body;

    if (!email || !token || !password) return res.sendStatus(400);

    const existingUser = await AuthModel.findOne({ email });

    if (!existingUser) return res.status(400).send("Email không tồn tại");

    const secret = existingUser.password + process.env.JWT_SECRET_TOKEN;

    try {
      jwt.verify(token, secret);
    } catch (error) {
      res.status(400).send("Token không hợp lệ");
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    await AuthModel.findOneAndUpdate(
      {
        email,
      },
      {
        password: hashed,
      }
    );

    res.send("Mật khẩu đã được đổi");
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
