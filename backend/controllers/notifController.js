const Notification = require('../models/notif.model')
const Disposisi = require('../models/disposisi.model')

// membuat notif
const createNotification = async ({ disposisiId, userId }) => {
  try {
    const notif = await Notification.create({
      disposisi: disposisiId,
      user: userId,
      status: 'Belum Dibaca',
      isDone: false
    });

    return notif;
  } catch (err) {
    console.error('Something went wrong:', err);
    throw err;
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const [notifications, countActive, countDone] = await Promise.all([
      Notification.find({
        user: userId,
        isDone: false
      })
        .populate('disposisi')
        .sort({ createdAt: -1 }),

      Notification.countDocuments({
        user: userId,
        isDone: false
      }),

      Notification.countDocuments({
        user: userId,
        isDone: true
      })
    ]);

    res.json({
      countActive,
      countDone,
      notifications
    });
  } catch (err) {
    console.error('Error getMyNotifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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

    await Disposisi.findByIdAndUpdate(
      notif.disposisi,
      { status_notif: true }, 
      { new: true }
    );

    res.json({
      message: 'Notifikasi selesai & status surat sudah terbaca',
      notification: notif
    });
  } catch (error) {
    console.error('markNotificationDone error:', error);
    res.status(500).json({ message: error.message });
  }
};


const getNotificationsAdmin = async (req, res) => {
  try {
    const query = {};

    if (req.query.suratId) {
      query.surat = req.query.suratId;
    }
    if (req.query.userId) {
      query.user = req.query.userId;
    }

    const data = await Notification.find(query)
      .populate('surat')
      .populate('user')
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error('Error getNotificationsAdmin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markNotificationDone,
  getNotificationsAdmin
};







