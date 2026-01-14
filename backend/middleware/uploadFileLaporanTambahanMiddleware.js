const multer = require('multer');

const upload_laporan_tambahan = multer({
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
    fileSize: 1024 * 1024 * 10 // 10MB
  }
});

module.exports = upload_laporan_tambahan;
