const mongoose = require("mongoose");

// Define embedded schema for activities (alternative to ObjectId reference)
const activitySchema = new mongoose.Schema({
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        roles: { 
            type: [String], 
            enum: ["admin", "editor", "viewer"], 
            default: ["viewer"] 
        }, // Role-based access control
        lastLogin: { type: Date, default: null }, // Last login timestamp
        activities: [activitySchema], // Embedded activities
        // activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserActivity" }], // Alternative: Reference to UserActivity model
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("User", userSchema);
