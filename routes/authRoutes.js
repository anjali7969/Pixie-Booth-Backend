const express = require("express");
const router = express.Router(); // Import the controller functions

const { registerUser, loginUser, changePassword } = require("../controller/authController");
const verifyToken = require("../middleware/verifyToken"); // this must be a function

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// PUT /api/auth/change-password
router.put("/change-password", verifyToken, changePassword); // make sure both are functions

module.exports = router;

// Export the router to use in the main app
