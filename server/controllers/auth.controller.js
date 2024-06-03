const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleErrors = require("../utils/errors");

// register a new user using the User model and save their data to the database
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      avatar,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    const inputErrors = handleErrors(err);
    return res.status(400).json({ inputErrors });
  }
};

// authenticate user login credentials and generate a JWT for authorization
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw Error("invalid email");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw Error("invalid password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: userPass, ...userInfo } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userInfo);
  } catch (err) {
    const inputErrors = handleErrors(err);
    return res.status(400).json({ inputErrors });
  }
};

// logout the currently active user by clearing the access token cookie
const logout = (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User logged out");
  } catch (err) {
    const logoutErrors = handleErrors(err);
    return res.status(400).json({ logoutErrors });
  }
};

module.exports = { register, login, logout };
