const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

/* CONFIGURATIONS */
const app = express();
dotenv.config();

/* DATABASE CONNECTION */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });

/* SERVER CONNECTION */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
