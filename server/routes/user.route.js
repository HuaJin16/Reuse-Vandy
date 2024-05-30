const express = require("express");
const { verifyToken } = require("../middleware/verifyUser");
const {
  updateUser,
  deleteUser,
  getPosts,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/posts/:id", verifyToken, getPosts);

module.exports = router;
