const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const UserActivity = require("../models/userActivityModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id, roles) => {
    return jwt.sign({ id, roles }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, roles } = req.body;

    // Default role as "viewer" if none provided
    const assignedRoles = roles && roles.length > 0 ? roles : ["viewer"];

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        roles: assignedRoles,
        activities: [{ action: "User registered" }], // ✅ Add activity correctly
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            token: generateToken(user.id, user.roles),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});


// @desc Authenticate user & get token
// @route POST /api/auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Update lastLogin timestamp
        user.lastLogin = Date.now();

        // ✅ Push new activity correctly
        user.activities.push({ action: "Logged In" });

        await user.save();

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            token: generateToken(user.id, user.roles),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});


// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id); // ❌ No need for .populate("activities")

    if (user) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            lastLogin: user.lastLogin,
            activities: user.activities, // ✅ Activities are already in the schema
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});


module.exports = { registerUser, loginUser, getUserProfile };
