const Post = require("../models/post.model");
const handleErrors = require("../utils/errors");

const newPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    return res.status(201).json(post);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) throw Error("unavailable");

    if (req.user.id !== post.userRef) throw Error("unauthorized");

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted");
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

module.exports = { newPost, deletePost };
