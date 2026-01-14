const express = require("express");
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const router = express.Router();
const {getMyNotifications, markNotificationDone } = require('../controllers/notifController');

//dapatin notif
router.get('/notification/my', verifyToken, authorizationRoles('pegawai', 'admin'),getMyNotifications);

// buat mark done notif
router.patch('/notifications/done/:id', verifyToken, authorizationRoles('pegawai', 'admin'), markNotificationDone);


module.exports = router;
