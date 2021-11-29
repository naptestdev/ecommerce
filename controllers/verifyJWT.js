const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken)
    return res.status(400).send({
      message: "Access token is not provided",
    });

  jwt.verify(authToken, process.env.JWT_SECRET_TOKEN, (err, user) => {
    if (err)
      return res.status(400).send({
        message: "The access token is invalid",
      });
    else {
      req.user = user;
      next();
    }
  });
};

module.exports.verifyJWT = verifyJWT;
