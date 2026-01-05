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
