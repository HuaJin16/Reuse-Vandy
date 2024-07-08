const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const handleErrors = require("../utils/errors");

// send a message to a specified user and updates the conversation
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const recipientId = req.params.userId;
    const senderId = req.user.id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      throw Error("Recipient not found");
    }

    const sender = await User.findById(senderId);

    let conversation = await Conversation.findOne({
      users: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        users: [senderId, recipientId],
      });
    }

    const newMessages = new Message({
      senderId,
      recipientId,
      message,
      conversationId: conversation._id,
    });

    conversation.messages.push(newMessages._id);

    await conversation.save();
    await newMessages.save();

    // create a notification for the recipient
    const notification = new Notification({
      recipientId,
      recipientName: recipient.firstName + " " + recipient.lastName,
      senderId,
      senderName: sender.firstName + " " + sender.lastName,
      notifType: "new_message",
      read: false,
    });

    await notification.save();

    // emit the new message to all connected clients
    req.app.get("io").emit("new_message", newMessages);

    res.status(201).json(newMessages);
  } catch (err) {
    const messageErrors = handleErrors(err);
    res.status(400).json({ messageErrors });
  }
};

// retrieves messages between the current user and a specified user
const getMessages = async (req, res) => {
  try {
    const recipientId = req.params.userId;
    const senderId = req.user.id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      throw Error("Recipient not found");
    }

    const conversation = await Conversation.findOne({
      users: { $all: [senderId, recipientId] },
    }).populate("messages");

    if (!conversation) {
      throw Error("No conversation found");
    }

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (err) {
    const messageErrors = handleErrors(err);
    res.status(400).json({ messageErrors });
  }
};

// retrieves a list of all conversations for the current user
const getMessagesList = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      users: req.user.id,
    })
      .populate("users", "firstName lastName avatar")
      .populate("messages");

    if (!conversations) {
      throw Error("No conversation found");
    }

    const messagesList = conversations.map((conv) => {
      const otherUser = conv.users.find(
        (user) => user._id.toString() !== req.user.id
      );
      return {
        conversationId: conv._id,
        recipient: otherUser,
        lastMessage: conv.messages[0],
      };
    });

    res.status(200).json(messagesList);
  } catch (err) {
    const messageErrors = handleErrors(err);
    res.status(400).json({ messageErrors });
  }
};

module.exports = { sendMessage, getMessages, getMessagesList };
