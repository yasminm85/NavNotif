const express = require("express");
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const router = express.Router();
const { createNotification, getMyNotifications, markNotificationDone, getNotificationsAdmin } = require('../controllers/notifController');

router.post('/create-notif', createNotification);
router.get('/notification/my', verifyToken, authorizationRoles('pegawai', 'admin'),getMyNotifications);
router.get('/notifications/admin', getNotificationsAdmin);

router.patch('/notifications/done/:id', verifyToken, authorizationRoles('pegawai', 'admin'), markNotificationDone);


module.exports = router;
