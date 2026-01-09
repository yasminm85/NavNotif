const Display = require('../models/display.model')
const DurationAgenda = require('../models/durationAgenda.model')
const fs = require('fs');
const path = require('path');

// dapatin semua gambar atau video
const getAllMedia = async (req, res) => {
    try {
        const display = await Display.find({});
        res.status(200).json(display);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// nambahin gambar atau video
const createMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const display = await Display.create({
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            path: req.file.path,
            duration: req.body.duration
        });

        const ext = path.extname(req.file.originalname);
        const newFilename = `media-${display.id}${ext}`;
        const newPath = path.join('uploads/display', newFilename);

        fs.renameSync(req.file.path, newPath);

        display.filename = newFilename;
        display.path = newPath;
        await display.save();

        res.status(201).json({
            message: 'File uploaded successfully',
            display
        });

    } catch (error) {
        console.error(error);
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ message: error.message });
    }
};

// dapatin durasi dari agenda
const getAgendaDuration = async (req, res) => {
    try {
        const duration = await DurationAgenda.findOne().sort({ createdAt: -1 });
        res.status(200).json(duration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// buat agenda baru
const createAgendaDuration = async (req, res) => {
    try {
        console.log('BODY:', req.body); 
        const agenda = await DurationAgenda.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true }
        );
        res.status(200).json(agenda);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// hapus gambar atau video
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const display = await Display.findById(id);

        if (!display) {
            return res.status(404).json({ message: "Media not found" });
        }

        const filePath = path.join(
            __dirname,
            '../uploads/display/',
            display.filename
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Display.findByIdAndDelete(id);

        res.status(200).json({ message: "Media successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMedia,
    createAgendaDuration,
    deleteMedia,
    getAllMedia,
    getAgendaDuration
};