const express = require("express");
const router = express.Router();
const { createNotification, getMyNotifications, markNotificationDone, getNotificationsAdmin } = require('../controllers/notifController');

router.post('/create-notif', createNotification);
router.get('/my', getMyNotifications);
router.patch('/:id/done', markNotificationDone);
router.get('/notif/admin', getNotificationsAdmin);

module.exports = router;
