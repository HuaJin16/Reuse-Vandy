const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const SavedPost = mongoose.model("SavedPost", savedPostSchema);

module.exports = SavedPost;
