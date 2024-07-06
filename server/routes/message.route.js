const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getMessagesList,
} = require("../controllers/message.controller");
const { verifyToken } = require("../middleware/verifyUser");

router.post("/send/:userId", verifyToken, sendMessage);
router.get("/get/:userId", verifyToken, getMessages);
router.get("/messages", verifyToken, getMessagesList);

module.exports = router;
