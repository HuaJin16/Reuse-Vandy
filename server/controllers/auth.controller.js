const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleErrors = require("../utils/errors");

/* USER REGISTER */
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    const inputErrors = handleErrors(err);
    return res.status(400).json({ inputErrors });
  }
};

/* USER LOGIN */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw Error("invalid email");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw Error("invalid password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: userPass, ...userInfo } = user._doc;
    res.cookie("token", token, { httpsOnly: true }).status(200).json(userInfo);
  } catch (err) {
    const inputErrors = handleErrors(err);
    return res.status(400).json({ inputErrors });
  }
};

module.exports = { register, login };
