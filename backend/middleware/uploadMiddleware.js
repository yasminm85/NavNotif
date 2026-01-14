const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(), 
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      callback(null, true);
    } else {
      callback(new Error('Only PDF & DOC allowed'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2 // 2MB
  }
});

module.exports = upload;
