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
    tickets: {
      type: Boolean,
      default: false,
    },
    clothes: {
      type: Boolean,
      default: false,
    },
    merch: {
      type: Boolean,
      default: false,
    },
    electronics: {
      type: Boolean,
      default: false,
    },
    furniture: {
      type: Boolean,
      default: false,
    },
    housing: {
      type: Boolean,
      default: false,
    },
    books: {
      type: Boolean,
      default: false,
    },
    miscellaneous: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: false,
    },
    lightlyUsed: {
      type: Boolean,
      default: false,
    },
    used: {
      type: Boolean,
      default: false,
    },
    obo: {
      type: Boolean,
      default: false,
    },
    free: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
