const express = require("express");
const { getUserStats, getRoleDistribution, getLoginTrends } = require("../controllers/analyticsController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes (Admin only)
router.get("/user-stats", protect, admin, getUserStats); // Bar Chart - User signups per week
router.get("/role-distribution", protect, admin, getRoleDistribution); // Pie Chart - Role distribution
router.get("/login-trends", protect, admin, getLoginTrends); // Line Chart - Login trends over time

module.exports = router;
