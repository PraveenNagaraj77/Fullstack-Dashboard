const mongoose = require("mongoose");

const userActivitySchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Relationship with User
        action: { type: String, required: true }, // e.g., "Logged In", "Updated Profile"
        timestamp: { type: Date, default: Date.now },
    }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
