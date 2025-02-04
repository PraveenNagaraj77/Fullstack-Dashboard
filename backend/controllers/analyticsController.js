const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Get user statistics (Bar Chart - User signups per week)
// @route   GET /api/analytics/user-stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
    const userStats = await User.aggregate([
        {
            $group: {
                _id: { 
                    year: { $year: "$createdAt" }, 
                    week: { $isoWeek: "$createdAt" } 
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.week": 1 } },
    ]);

    res.json(userStats);
});

// @desc    Get role distribution (Pie Chart - Role distribution)
// @route   GET /api/analytics/role-distribution
// @access  Private/Admin
const getRoleDistribution = asyncHandler(async (req, res) => {
    const roleDistribution = await User.aggregate([
        { $unwind: "$roles" }, // Unwind roles array
        {
            $group: {
                _id: "$roles",
                count: { $sum: 1 },
            },
        },
    ]);

    res.json(roleDistribution.map((role) => ({
        role: role._id,
        count: role.count,
    })));
});

// @desc    Get login trends (Line Chart - Logins over time)
// @route   GET /api/analytics/login-trends
// @access  Private/Admin
const getLoginTrends = asyncHandler(async (req, res) => {
    const loginTrends = await User.aggregate([
        {
            $group: {
                _id: { 
                    year: { $year: "$lastLogin" }, 
                    day: { $dayOfYear: "$lastLogin" } 
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.day": 1 } },
    ]);

    res.json(loginTrends);
});

module.exports = { getUserStats, getRoleDistribution, getLoginTrends };
