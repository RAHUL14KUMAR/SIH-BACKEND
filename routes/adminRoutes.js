const express = require("express");
const { loginAdmin, registerAdmin,getMe, complaintGoToAdmin, createPathForComplaint } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.get("/profile", protect, getMe);
router.get("/complaintList",protect,complaintGoToAdmin);
router.post("/:id/postPath",createPathForComplaint);

module.exports = router;