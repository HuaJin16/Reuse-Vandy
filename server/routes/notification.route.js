const express = require("express");
const { verifyToken } = require("../middleware/verifyUser");
const {
  getNotifications,
  updateNotificationAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/get/:userId", verifyToken, getNotifications);
router.post("/update/:notificationId", verifyToken, updateNotificationAsRead);
router.delete("/delete/:notificationId", verifyToken, deleteNotification);

module.exports = router;
