const mongoose = require('mongoose')

const DisplaySchema = mongoose.Schema(
    {
        filename: {
            type: String,
            required: false,
        },
        mimetype: {
            type: String,
            required: false,
        },
        display_path: {
            type: String,
            required: false,
        },
        displayFileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fs.files',
            default: null
        },
        duration: { 
            type: Number,
            default: null,
        },

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Display", DisplaySchema);
