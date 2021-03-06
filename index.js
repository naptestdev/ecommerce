const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv/config");

const AuthRoute = require("./routes/AuthRoute");
const LandingRoute = require("./routes/LandingRoute");
const ProductRoute = require("./routes/ProductRoute");
const CartRoute = require("./routes/CartRoute");
const PaymentRoute = require("./routes/PaymentRoute");
const ReviewsRoute = require("./routes/ReviewsRoute");

if (process.env.NODE_ENV !== "production")
  app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.enable("trust proxy");

mongoose.connect(process.env.MONGODB_URI, {}, () =>
  console.log("Connected to MongoDB Database")
);

app.use("/api/auth", AuthRoute);
app.use("/api/landing", LandingRoute);
app.use("/api/product", ProductRoute);
app.use("/api/cart", CartRoute);
app.use("/api/payment", PaymentRoute);
app.use("/api/reviews", ReviewsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist", { cacheControl: false }));

  app.get("*", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello from eCommerce server");
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
