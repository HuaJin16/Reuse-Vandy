const express = require("express");
const { verifyToken } = require("../middleware/verifyUser");
const { updateUser, deleteUser } = require("../controllers/user.controller");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

module.exports = router;
