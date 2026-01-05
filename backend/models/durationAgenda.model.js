const mongoose = require('mongoose')

const DurationAgendaSchema = mongoose.Schema(
    {
        agenda_kegiatan_duration: {
            type: Number,
            default: null
        },
        agenda_hariini_duration: {
            type: Number,
            default: null
        },
        agenda_selesai: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("DurationAgenda", DurationAgendaSchema);

