const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notification.controller");

router.get("/get/:userId", getNotifications);

module.exports = router;
