const mongoose = require('mongoose')

const DisposisiSchema = mongoose.Schema(
    {
        nama_kegiatan: {
            type: String,
            required: true,
        },

        agenda_kegitan: {
            type: String,
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
            default:"selesai"
        },

        tempat: {
            type: String,
            required: true,
        },

        file_path: {
            type: String,
            required: true,
        },

        catatan: {
            type: String,
            required: false,
        },

        dresscode: {
            type: String,
            required: false,
        },

        status: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true
    }
);

const Disposisi = mongoose.model("Disposisi", DisposisiSchema);

module.exports = Disposisi;