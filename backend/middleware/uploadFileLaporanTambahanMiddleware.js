const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, fiqle, cb) {
        cb(null, 'uploads/tambahan/')
    },
    filename: function(req, laporan_tambahan_path, cb) {
        let ext = path.extname(laporan_tambahan_path.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload_laporan = multer ({
    storage: storage,
    fileFilter: function(req, laporan_tambahan_path, callback) {
        if(
            laporan_tambahan_path.mimetype == "application/pdf" ||
            laporan_tambahan_path.mimetype == "application/doc"
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