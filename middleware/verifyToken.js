const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
// This function should be used in routes that require authentication
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // ✅ ensures user ID is accessible as req.user.id
        next();
    } catch (err) {
        console.error("JWT error:", err.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
