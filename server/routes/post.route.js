const express = require("express");
const {
  newPost,
  deletePost,
  editPost,
  getPost,
} = require("../controllers/post.controller");
const { verifyToken } = require("../middleware/verifyUser");

const router = express.Router();

router.post("/new", verifyToken, newPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.post("/edit/:id", verifyToken, editPost);
router.get("/get/:id", getPost);

module.exports = router;
