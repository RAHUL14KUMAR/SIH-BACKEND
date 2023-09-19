const express = require("express");
const { login, register,launchComplaint, getMe, getUserComplain } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getcomplaints",protect,getUserComplain);
router.post("/launch",protect,launchComplaint);
router.get("/profile", protect, getMe);

module.exports = router;