const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/display/')
    },
    filename: function(req, display_path, cb) {
        let ext = path.extname(display_path.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload_file_display = multer ({
    storage: storage,
    fileFilter: function(req, display_path, callback) {
        if(
            display_path.mimetype == "image/png" ||
            display_path.mimetype == "image/jpeg" ||
            display_path.mimetype == "video/mp4" ||
            display_path.mimetype == "video/webm"
        ){
            callback(null, true)
        } else {
            console.log('only JPG, PNG, MP4, WebM support!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 50
    }

})

module.exports = upload_file_display