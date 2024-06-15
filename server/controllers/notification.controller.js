const Notification = require("../models/notification.model");
const handleErrors = require("../utils/errors");

// retrieve all notifications for the user, including post details
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.params.userId,
    }).populate("postInfo");
    if (notifications.length === 0) throw Error("No notifications found");

    res.status(200).json(notifications);
  } catch (err) {
    const notificationErrors = handleErrors(err);
    res.status(400).json(notificationErrors);
  }
};

// mark a notification as read by updating its "read" property to true
const updateNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) throw Error("No notifications found");

    const updatedReadStatus = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );
    res.status(200).json(updatedReadStatus);
  } catch (err) {
    const notificationErrors = handleErrors(err);
    res.status(400).json(notificationErrors);
  }
};

// delete a notification by its ID
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) throw Error("No notifications found");

    await Notification.findByIdAndDelete(req.params.notificationId);
    res.status(200).json("Notification deleted");
  } catch (err) {
    const notificationErrors = handleErrors(err);
    res.status(400).json(notificationErrors);
  }
};

module.exports = {
  getNotifications,
  updateNotificationAsRead,
  deleteNotification,
};
