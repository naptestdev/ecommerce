const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../controllers/verifyJWT");
const jwt = require("jsonwebtoken");

// Only for demo
const USERS = [
  {
    username: "admin",
    password: "admin",
  },
];

router.post("/sign-in", async (req, res) => {
  try {
    const existingUser = USERS.find(
      (user) => user.username === req.body.username
    );

    if (!existingUser)
      return res.status(404).send({
        errorSection: "username",
        message: "Tên đăng nhập không tìm thấy",
      });

    if (req.body.password !== existingUser.password)
      return res.status(400).send({
        errorSection: "password",
        message: "Sai mật khẩu",
      });

    const user = {
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
    const existingUser = USERS.find(
      (user) => user.username === req.user.username
    );

    const user = {
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
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
