const User = require("../models/user.model");
const handleErrors = require("../utils/errors");
const bcrypt = require("bcrypt");
const Post = require("../models/post.model");
const SavedPost = require("../models/savedPost.model");

// update the user's infromation if authorized
const updateUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) throw Error("unauthorized");

    if (req.body.password) {
      if (req.body.password.length < 6) {
        throw Error("longer password required");
      }
      const salt = await bcrypt.genSalt();
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // replace the user's information with the provided value
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      // return the user's updated document
      { new: true }
    );
    const { password, ...userInfo } = updatedUser._doc;
    res.status(200).json(userInfo);
  } catch (err) {
    const authErrors = handleErrors(err);
    return res.status(400).json({ authErrors });
  }
};

// delete the currently active user and removes their access token cookie
const deleteUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) throw Error("unauthorized");

    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted");
  } catch (err) {
    const authErrors = handleErrors(err);
    return res.status(400).json({ authErrors });
  }
};

// retrieve all posts created by the specified user
const getPosts = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) throw Error("unauthorized");

    const posts = await Post.find({ userRef: req.params.id });
    res.status(200).json(posts);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// toggles saving or unsaving a post for a user
const saveUnsavePost = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) throw Error("unauthorized");
    const userId = req.params.userId;
    const postId = req.params.postId;

    // find the SavedPost document for the specified user
    const savedPostDoc = await SavedPost.findOne({
      userId,
    });

    // if savedPostDoc exists, updated our savedPosts array
    if (savedPostDoc) {
      // if the post is already saved, remove the postId from the savedPosts array
      if (savedPostDoc.savedPosts.includes(postId)) {
        savedPostDoc.savedPosts = savedPostDoc.savedPosts.filter(
          (id) => id.toString() !== postId
        );
        await savedPostDoc.save();
        return res.status(200).json({ message: "Post unsaved successfully " });
      }
      // if the post is not saved, add the postId to the savedPosts array
      else {
        savedPostDoc.savedPosts.push(postId);
        await savedPostDoc.save();
        return res.status(200).json({ message: "Post saved successfully" });
      }
    }
    // if savedPostDoc does not exist, create one using the SavedPost model
    else {
      const newSavedPost = new SavedPost({
        userId: userId,
        savedPosts: [postId],
      });
      await newSavedPost.save();
      return res.status(200).json({ message: "Post saved sucessfully" });
    }
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// retrieve all posts saved by the specified user
const getSavedPosts = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) throw Error("unauthorized");
    const userId = req.params.userId;

    // find all SavedPost user documents and populate with the post data
    const userSavedPosts = await SavedPost.findOne({ userId }).populate({
      path: "savedPosts",
      model: "Post",
    });

    if (userSavedPosts.savedPosts.length === 0)
      throw Error("No saved posts found");

    res.status(200).json(userSavedPosts);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getPosts,
  saveUnsavePost,
  getSavedPosts,
};
