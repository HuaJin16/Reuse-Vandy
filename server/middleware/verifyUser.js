const jwt = require("jsonwebtoken");
const handleErrors = require("../utils/errors");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) throw Error("unauthorized");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) throw Error("invalid token");
      req.user = decoded;
      next();
    });
  } catch (err) {
    const authErrors = handleErrors(err);
    return res.status(400).json({ authErrors });
  }
};

module.exports = { verifyToken };
