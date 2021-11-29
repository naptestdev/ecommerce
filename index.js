const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv/config");

const AuthRoute = require("./routes/AuthRoute");
const LandingRoute = require("./routes/LandingRoute");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.enable("trust proxy");

mongoose.connect(process.env.MONGODB_URI, {}, () =>
  console.log("Connected to MongoDB Database")
);

app.get("/", (req, res) => {
  res.send("Hello from eCommerce server");
});

app.use("/api/auth", AuthRoute);
app.use("/api/landing", LandingRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
