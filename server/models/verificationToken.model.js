const mongoose = require("mongoose");

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

module.exports = VerificationToken;
