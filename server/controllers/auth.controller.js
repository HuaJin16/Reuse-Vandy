const User = require("../models/user.model");
const VerificationToken = require("../models/verificationToken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleErrors = require("../utils/errors");
const transporter = require("../utils/transporter");
const crypto = require("crypto");

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
      isVerified: false,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newToken = new VerificationToken({
      userId: newUser._id,
      token: verificationToken,
    });

    //send verification email
    const url = `http://localhost:5173/verify/${verificationToken}`;
    await transporter(email, "verify email", url);

    // save the data if the email was sent successfully
    const savedUser = await newUser.save();
    await newToken.save();

    // emit a socket event for newly registered users
    req.app.get("io").emit("new_user", {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
    });

    res.status(201).json({
      message:
        "User registered. Please check your email to verify your account",
    });
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

    if (!user.isVerified) {
      // delete any existing tokens for the user
      await VerificationToken.deleteMany({ userId: user._id });

      const verificationToken = crypto.randomBytes(32).toString("hex");
      const newToken = new VerificationToken({
        userId: user._id,
        token: verificationToken,
      });

      //send verification email
      const url = `http://localhost:5173/verify/${verificationToken}`;
      await transporter(user.email, "verify email", url);

      await newToken.save();

      throw Error("Verify email");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw Error("invalid password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: userPass, ...userInfo } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userInfo);
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
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

// verifies the user's email using token and updates status and deltes token
const verifyEmail = async (req, res) => {
  try {
    const token = await VerificationToken.findOne({ token: req.params.token });
    if (!token) throw Error("No token found");

    const user = await User.findOne({ _id: token.userId });
    if (!user) throw Error("No user(s) found");

    await User.findByIdAndUpdate(user._id, { isVerified: true }, { new: true });
    await VerificationToken.findByIdAndDelete(token._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
};

// sends a pssword reset link to the user's email using a JWT token
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw Error("invalid email");

    const user = await User.findOne({ email });
    if (!user) throw Error("invalid email");

    // generate a JWT token to be used in the url link
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //send reset password email link
    const url = `http://localhost:5173/reset/${resetToken}`;
    await transporter(email, "reset password", url);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
};

// updates the user's password using the provided token and new password
const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { newPassword } = req.body;

    if (!token) throw Error("No token found");

    if (!newPassword) throw Error("Password is required");

    let userId = "";
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      // checks if the token has expired
      if (err) throw Error("No token found");
      userId = decoded.id;
    });

    const user = await User.findById(userId);
    if (!user) throw Error("No user(s) found");

    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) throw Error("Same password");

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
