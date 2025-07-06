const express = require("express");
const router = express.Router();
const { saveImage, getUserImages } = require("../controller/galleryController");
const verifyToken = require("../middleware/verifyToken");

// Save clicked image
router.post("/save", verifyToken, saveImage);

// Get gallery images
router.get("/my-gallery", verifyToken, getUserImages);

module.exports = router;
