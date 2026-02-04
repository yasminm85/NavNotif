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
            required: false,
        },
        ruangan: {
            type: String,
            required: false,
        },
        file_path: {
            type: String,
            required: false,
        },
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fs.files',
            default: null
        },
        catatan: {
            type: String,
            required: false,
        },

        dresscode: {
            type: String,
            required: false,
        },

        laporan: {
            type: String,
            default: null
        },
        laporanFileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fs.files',
            default: null
        },
        laporan_file_path: {
            type: String,
            default: null
        },

        laporan_status: {
            type: String,
            enum: ['BELUM', 'SUDAH'],
            default: 'BELUM'
        },

        laporan_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },

        laporan_at: {
            type: Date,
            default: null
        },

        komentar: {
            type: String,
            default: null
        },

        status_notif: {
            type: Boolean,
            default: false
        },

        laporan_tambahan: {
            type: String,
            default: null
        },

        laporan_tambahan_path: {
            type: String,
            default: null
        },
        laporanFileTambahanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fs.files',
            default: null
        },

        laporan_tambahan_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },

        laporan_tambahan_status: {
            type: String,
            enum: ['BELUM', 'SUDAH'],
            default: 'BELUM'
        },

        laporan_tambahan_at: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Disposisi", DisposisiSchema);
