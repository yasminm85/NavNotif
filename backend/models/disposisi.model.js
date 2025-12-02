const mongoose = require('mongoose')

const DisposisiSchema = mongoose.Schema(
    {
        nama_kegiatan: {
            type: String,
            required: true,
        },

        agenda_kegiatan: {
            type: String,
            required: true,
        },

        nama_yang_dituju: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        direktorat: {
            type: [String],
            required: true,
        },

        divisi: {
            type: [String],
            required: true,
        },

        tanggal: {
            type: Date,
            required: true,
        },

        jam_mulai: {
            type: String,
            required: true,
        },

        jam_selesai: {
            type: String,
            required: false,
            default: "selesai"
        },

        tempat: {
            type: String,
            required: true,
        },

        file_path: {
            type: String,
            required: false,
        },

        catatan: {
            type: String,
            required: false,
        },

        dresscode: {
            type: String,
            required: false,
        },
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Disposisi", DisposisiSchema);