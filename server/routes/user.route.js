const express = require("express");
const { verifyToken } = require("../middleware/verifyUser");
const {
  getUser,
  updateUser,
  deleteUser,
  getPosts,
  saveUnsavePost,
  getSavedPosts,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/:userId", verifyToken, getUser);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/posts/:id", verifyToken, getPosts);
router.put("/saveUnsave/:userId/:postId", verifyToken, saveUnsavePost);
router.get("/savedPosts/:userId", verifyToken, getSavedPosts);

module.exports = router;
