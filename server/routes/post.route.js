const express = require("express");
const {
  newPost,
  deletePost,
  editPost,
  getPost,
  getPosts,
} = require("../controllers/post.controller");
const { verifyToken } = require("../middleware/verifyUser");

const router = express.Router();

router.post("/new", verifyToken, newPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.post("/edit/:id", verifyToken, editPost);
router.get("/get/:id", getPost);
router.get("/get", getPosts);

module.exports = router;
