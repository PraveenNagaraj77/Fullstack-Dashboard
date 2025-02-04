const express = require("express");
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes (Only Admin can manage users)
router.get("/", protect, admin, getUsers); // Get all users
router.get("/:id", protect, admin, getUserById); // Get user by ID
router.put("/:id", protect, admin, updateUser); // Update user
router.delete("/:id", protect, admin, deleteUser); // Delete user

module.exports = router;
