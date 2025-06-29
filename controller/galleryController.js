const Gallery = require("../model/Gallery");

// Save image
const saveImage = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ set by verifyToken middleware
        const { imageUrl } = req.body;

        const newImage = new Gallery({ user: req.user.id, imageUrl });

        await newImage.save();

        res.status(201).json({ success: true, message: "Image saved" });
    } catch (err) {
        console.error("Save image error:", err);
        res.status(500).json({ success: false, message: "Failed to save image" });
    }
};
// 🔐 Ensure user is authenticated





// Get images for logged-in user
const getUserImages = async (req, res) => {
    try {
        const images = await Gallery.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, images });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch images" });
    }
};

module.exports = { saveImage, getUserImages };
