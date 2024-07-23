const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verify/:token", verifyEmail);

module.exports = router;
