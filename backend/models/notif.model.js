const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
    disposisi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disposisi',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Belum Dibaca', 'Terbaca'],
      default: 'Belum Dibaca'
    },
    isDone: {
      type: Boolean,
      default: false,
    },

    doneAt: {
      type: Date
    }


}, 
    { 
        timestamps: true, 
    }
);

module.exports = mongoose.model("Notification", NotificationSchema);