const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Express app
const app = express();

// Middleware
app.use(cors());

// ✅ Increase payload size limit for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ User routes
// const uploadRoute = require("./routes/uploadRoute");




// To serve uploaded profile images publicly
app.use("/public", express.static("public"));

app.use("/api/auth", authRoutes);      // Login, Register, Change Password
app.use("/api/user", userRoutes);      // Profile Update, Upload Profile Image
// app.use("/api", uploadRoute);          // Generic upload
app.use("/api/gallery", require("./routes/galleryRoutes")); // Gallery



// Test route
app.get("/", (req, res) => {
  res.send("🎉 PixieBooth Backend is Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
