const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const UserActivity = require("../models/userActivityModel");

// @desc Get all users (Admin only)
// @route GET /api/users
// @access Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private (Admin)
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc Update user profile & roles
// @route PUT /api/users/:id
// @access Private (Admin)
const updateUser = asyncHandler(async (req, res) => {
    const { username, email, roles } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.username = username || user.username;
        user.email = email || user.email;
        user.roles = roles || user.roles;

        // Append activity to the embedded `activities` array
        user.activities.push({
            action: "Updated Profile",
            timestamp: new Date(),
        });

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            roles: updatedUser.roles,
            activities: updatedUser.activities, // Return activities in response
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();

    // Optional: If you want to track admin activity
    const admin = await User.findById(req.user.id); // Assuming req.user is the admin
    if (admin) {
        admin.activities.push({
            action: `Deleted user: ${user.email}`,
            timestamp: new Date(),
        });
        await admin.save();
    }

    res.json({ message: "User deleted successfully" });
});


module.exports = { getUsers, getUserById, updateUser, deleteUser };
