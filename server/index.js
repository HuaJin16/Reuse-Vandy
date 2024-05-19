const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.route");
const cors = require("cors");

/* CONFIGURATIONS */
const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

/* DATABASE CONNECTION */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });

/* ROUTES */
app.use("/auth", authRoutes);

/* SERVER CONNECTION */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
