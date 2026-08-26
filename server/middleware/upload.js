const multer = require("multer");
const path = require("path");

// stores uploaded listing images in the uploads folder with a unique file name
// this keeps image handling optional but working out of the box
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isAllowed = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png and webp images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb per image
});

module.exports = upload;
