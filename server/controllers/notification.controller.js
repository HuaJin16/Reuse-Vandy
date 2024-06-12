const Notification = require("../models/notification.model");

// retrieve all notifications for the user, including post details
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.params.userId,
    }).populate("postInfo");
    res.status(200).json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getNotifications };
