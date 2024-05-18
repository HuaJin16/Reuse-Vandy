const express = require("express");
const dotenv = require("dotenv");

/* CONFIGURATIONS */
const app = express();
dotenv.config();

/* SERVER CONNECTION */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
