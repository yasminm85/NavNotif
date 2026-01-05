const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/laporan/')
    },
    filename: function(req, laporan_file_path, cb) {
        let ext = path.extname(laporan_file_path.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload_laporan = multer ({
    storage: storage,
    fileFilter: function(req, laporan_file_path, callback) {
        if(
            laporan_file_path.mimetype == "application/pdf" ||
            laporan_file_path.mimetype == "application/doc"
        ){
            callback(null, true)
        } else {
            console.log('only pdf & doc support!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 10
    }

})

module.exports = upload_laporan