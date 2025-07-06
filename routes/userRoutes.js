const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { authenticateToken } = require("../middleware/authMiddleware");
const User = require("../model/User");

// ✅ Ensure profile image upload directory exists
const uploadDir = path.join(__dirname, "../public/uploads/profile");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer config for profile picture upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// ✅ Upload profile image
router.post("/upload-profile", upload.single("profilePicture"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        fileName: req.file.filename
    });
});

// ✅ Update user profile (name, email, profileImage)
router.put("/update-profile", authenticateToken, async (req, res) => {
    const { name, email, profileImage } = req.body;
    const userId = req.user.id;

    try {
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (profileImage) updateFields.profileImage = profileImage;

        const updated = await User.findByIdAndUpdate(userId, updateFields, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updated._id,
                name: updated.name,
                email: updated.email,
                profileImage: updated.profileImage || ""
            }
        });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Update failed", error: err.message });
    }
});

module.exports = router;
