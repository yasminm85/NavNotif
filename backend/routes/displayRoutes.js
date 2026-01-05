const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const {createMedia } = require('../controllers/displayController');
const upload_display = require('../middleware/uploadFileDisplayMiddleware')
const router = express.Router();

// route create media
router.post('/create-media', verifyToken, authorizationRoles('admin'), upload_display.single('display_path'), createMedia);



module.exports = router;