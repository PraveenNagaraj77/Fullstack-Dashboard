const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user

// Protected Routes
router.get("/profile", protect, getUserProfile); // Get user profile (requires authentication)

module.exports = router;
