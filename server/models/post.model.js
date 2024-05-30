const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [3, "Minimum of 3 characters required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required (Enter 0 if free)"],
    },
    description: {
      type: String,
      required: [true, "Description of post is required"],
      minLength: [10, "Minimum of 10 characters required"],
    },
    imageUrls: {
      type: Array,
      validate: {
        validator: function (urls) {
          return urls.length > 0;
        },
        message: "At least one image URL is required when creating post",
      },
    },
    userRef: {
      type: String,
      required: [true, "A valid user reference is required"],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
