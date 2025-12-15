const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        require: true,
        enum: ["admin", "pegawai"],
    },
}, 
    { 
        timestamps: true, 
    }
);

module.exports = mongoose.model("User", userSchema);