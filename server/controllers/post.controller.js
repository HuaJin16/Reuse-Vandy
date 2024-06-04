const Post = require("../models/post.model");
const handleErrors = require("../utils/errors");
const mongoose = require("mongoose");

// create a new user post using the Post model
const newPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    return res.status(201).json(post);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// delete a user post
const deletePost = async (req, res) => {
  try {
    // check if the post exists
    const post = await Post.findById(req.params.id);
    if (!post) throw Error("unavailable");

    // check if user is the owner of the post
    if (req.user.id !== post.userRef) throw Error("unauthorized");
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted");
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// update an existing post
const editPost = async (req, res) => {
  try {
    // check if the post exists
    const post = await Post.findById(req.params.id);
    if (!post) throw Error("unavailable");

    // check if user is the owner of the post
    if (req.user.id !== post.userRef) throw Error("unauthorized");

    const editedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(editedPost);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// retrieve a post through its ID
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw Error("unavailable");
    res.status(200).json(post);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

module.exports = { newPost, deletePost, editPost, getPost };
