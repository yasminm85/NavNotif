const mongoose = require('mongoose')

const DurationAgendaSchema = mongoose.Schema({
    agenda_selesai_start: {
        type: Date,
        required: true
    },
    agenda_selesai_end: {
        type: Date,
        required: true
    }
}, { timestamps: true }
);


module.exports = mongoose.model("DurationAgenda", DurationAgendaSchema);

