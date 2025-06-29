const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// User Schema

// This schema defines the structure of user documents in MongoDB
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"]
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
            select: false // Don't return password in queries by default
        },
        profileImage: {
            type: String,
            default: ""
        }

    },
    { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
