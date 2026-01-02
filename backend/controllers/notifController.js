const Notification = require('../models/notif.model')
const Disposisi = require('../models/disposisi.model')

// dapatin notifikasi di dashboard biar muncul teng notif nya
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const now = new Date();

    const [onCreate, countActive, countDone, reminders] = await Promise.all([
      Notification.find({ user: userId, isDone: false, notifType: "ON_CREATE" })
        .populate("disposisi")
        .sort({ createdAt: -1 }),

      Notification.countDocuments({ user: userId, isDone: false, notifType: "ON_CREATE" }),
      Notification.countDocuments({ user: userId, isDone: true, notifType: "ON_CREATE" }),

      Notification.find({
        user: userId,
        isDone: false,
        notifType: { $in: ["REMINDER_1H", "REMINDER_30M"] },
        sendAt: { $lte: now }
      })
        .populate("disposisi")
        .sort({ sendAt: 1 })
        .limit(20) 
    ]);

    if (reminders.length > 0) {
      await Notification.updateMany(
        { _id: { $in: reminders.map((r) => r._id) } },
        { $set: { isDone: true } }
      );
    }

    res.json({ countActive, countDone, notifications: onCreate, reminders });
  } catch (err) {
    console.error("Error getMyNotifications:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// menandakan bahwa notifikasi sudah diisi
const markNotificationDone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const notif = await Notification.findOne({ _id: id, user: userId });

    if (!notif) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
    }

    notif.status = 'Terbaca';
    notif.isDone = true;
    notif.doneAt = new Date();
    await notif.save();

    if (notif.notifType === 'ON_CREATE') {
      await Disposisi.findByIdAndUpdate(
        notif.disposisi,
        { status_notif: true },
        { new: true }
      );
    }

    res.json({
      message: 'Notifikasi sudah terbaca',
      notification: notif
    });
  } catch (error) {
    console.error('markNotificationDone error:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getMyNotifications,
  markNotificationDone,

};







