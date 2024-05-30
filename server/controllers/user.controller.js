const User = require("../models/user.model");
const handleErrors = require("../utils/errors");
const bcrypt = require("bcrypt");
const Post = require("../models/post.model");

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
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...userInfo } = updatedUser._doc;
    res.status(200).json(userInfo);
  } catch (err) {
    const authErrors = handleErrors(err);
    return res.status(400).json({ authErrors });
  }
};

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

module.exports = { updateUser, deleteUser, getPosts };
