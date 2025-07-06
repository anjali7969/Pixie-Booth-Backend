// const User = require("../model/User");
// const bcrypt = require("bcrypt");

// // 🔁 Change Password Controller
// const changePassword = async (req, res) => {
//     try {
//         const userId = req.user.id; // comes from verifyToken middleware
//         const { oldPassword, newPassword } = req.body;

//         if (!oldPassword || !newPassword) {
//             return res.status(400).json({ message: "Both old and new passwords are required" });
//         }

//         const user = await User.findById(userId).select("+password");
//         if (!user) return res.status(404).json({ message: "User not found" });

//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         await user.save();

//         res.json({ success: true, message: "Password updated successfully" });
//     } catch (err) {
//         console.error("Change password error:", err.message);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// module.exports = {
//     changePassword,
//     // ...other user-related exports
// };
