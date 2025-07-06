const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 🔑 Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "2h",
    });
};

// 📝 Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔐 Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage || ""
            }

        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Upload Controller
const uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Please upload a file" });

    try {
        const userId = req.user.id;
        const imagePath = req.file.path;

        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: imagePath },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Image uploaded and saved",
            filePath: imagePath,
            user: {
                id: user._id,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Failed to save profile image" });
    }
};


// 🔁 Change Password
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // comes from verifyToken middleware
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old and new passwords are required" });
        }

        const user = await User.findById(userId).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        user.password = newPassword; // 🔑 Let the pre-save hook handle hashing
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("Change password error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = { registerUser, loginUser, uploadImage, changePassword };
