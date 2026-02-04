const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/DOC allowed'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2 // 2MB
  }
});

const upload_file_tindaklanjut = upload.fields([
  { name: 'file_tindaklanjut', maxCount: 5 }
]);

module.exports = upload_file_tindaklanjut;
