const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv/config");

const AuthRoute = require("./routes/AuthRoute");
const HomeRoute = require("./routes/HomeRoute");
const BannersRoute = require("./routes/BannersRoute");
const UsersRoute = require("./routes/UsersRoute");
const ProductRoute = require("./routes/ProductRoute");
const OrderRoute = require("./routes/OrderRoute");
const ExportRoute = require("./routes/ExportRoute");

if (process.env.NODE_ENV !== "production")
  app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.enable("trust proxy");

mongoose.connect(process.env.MONGODB_URI, {}, () =>
  console.log("Connected to MongoDB Database")
);

app.use("/api/auth", AuthRoute);
app.use("/api/home", HomeRoute);
app.use("/api/banners", BannersRoute);
app.use("/api/users", UsersRoute);
app.use("/api/products", ProductRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/export", ExportRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello from eCommerce Admin Server");
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
