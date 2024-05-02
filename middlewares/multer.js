const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/products/images");
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

// Assuming you want to handle each image individually
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(new Error("File type not supported"), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 3 // 3MB limit per file
    }
}).fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]);

module.exports = upload;

