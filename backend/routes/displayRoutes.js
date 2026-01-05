const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const {createMedia, createAgendaDuration, deleteMedia, deleteDuration } = require('../controllers/displayController');
const upload_display = require('../middleware/uploadFileDisplayMiddleware')
const router = express.Router();

// route create media
router.post('/create-media', verifyToken, authorizationRoles('admin'), upload_display.single('display_path'), createMedia);

// route create duration
router.post('/create-duration', verifyToken, authorizationRoles('admin'), createAgendaDuration);

// route delete media
router.delete('/delete-media/:id', verifyToken, authorizationRoles('admin'), deleteMedia);

// router delete duration
router.delete('/delete-duration/:id', verifyToken, authorizationRoles('admin'), deleteDuration);



module.exports = router;