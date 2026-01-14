const multer = require('multer');

const upload_file_display = multer({
  storage: multer.memoryStorage(), 
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/webm"
    ) {
      cb(null, true);
    } else {
      cb(new Error('only JPG, PNG, MP4, WebM support!'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
});

module.exports = upload_file_display;
