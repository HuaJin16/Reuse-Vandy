const express = require("express");
const { newPost, deletePost } = require("../controllers/post.controller");
const { verifyToken } = require("../middleware/verifyUser");

const router = express.Router();

router.post("/new", verifyToken, newPost);
router.delete("/delete/:id", verifyToken, deletePost);

module.exports = router;
