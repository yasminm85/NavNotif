const mongoose = require('mongoose')

const TindakLanjutSchema = mongoose.Schema(
    {
        personil_yang_dituju: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        }],
        judul_arahan: {
            type: String,
            required: true
        },
        isi_arahan: {
            type: String,
            required: true
        },
        file_arahan: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fs.files',
            default: null
        }],
        judul_tindaklanjut: {
            type: String,
            required: false
        },
        isi_tindaklanjut: {
            type: String,
            required: false
        },
        file_tindaklanjut: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fs.files',
            default: null
        }],
        isTindakLanjut: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("TindakLanjut", TindakLanjutSchema)