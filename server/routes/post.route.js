const express = require("express");
const { newPost } = require("../controllers/post.controller");
const { verifyToken } = require("../middleware/verifyUser");

const router = express.Router();

router.post("/new", verifyToken, newPost);

module.exports = router;
