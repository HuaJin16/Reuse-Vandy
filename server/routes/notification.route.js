const express = require("express");
const { verifyToken } = require("../middleware/verifyUser");
const {
  getNotifications,
  updateNotificationAsRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/get/:userId", verifyToken, getNotifications);
router.post("/update/:notificationId", verifyToken, updateNotificationAsRead);

module.exports = router;
