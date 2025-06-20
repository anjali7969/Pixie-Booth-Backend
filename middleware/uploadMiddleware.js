const multer = require("multer");
const fs = require("fs");
const path = require("path");

const maxSize = 2 * 1024 * 1024; // 2MB
const uploadDir = "public/uploads/profile/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const cleanFileName = path
            .basename(file.originalname, ext)
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9.-]/g, "")
            .trim();

        cb(null, `IMG-${Date.now()}-${cleanFileName}${ext}`);
    },
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("File format not supported."), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSize },
}).single("profilePicture"); // This must match frontend field name

module.exports = upload;
// Usage in routes