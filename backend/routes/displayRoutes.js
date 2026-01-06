const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const {createMedia, createAgendaDuration, deleteMedia, deleteDuration, getAllMedia, getAgendaDuration } = require('../controllers/displayController');
const upload_display = require('../middleware/uploadFileDisplayMiddleware')
const router = express.Router();

// route get all media
router.get('/getAll-media', verifyToken, authorizationRoles('admin'), getAllMedia);

// route create media
router.post('/create-media', upload_display.single('display_path'), verifyToken, authorizationRoles('admin'), createMedia);

// route create duration
router.post('/create-duration', verifyToken, authorizationRoles('admin'), createAgendaDuration);

// route get duration (dipakai daftar display)
router.get('/get-duration', verifyToken, authorizationRoles('admin'), getAgendaDuration);

// route delete media
router.delete('/delete-media/:id', verifyToken, authorizationRoles('admin'), deleteMedia);

// router delete duration
router.delete('/delete-duration/:id', verifyToken, authorizationRoles('admin'), deleteDuration);



module.exports = router;