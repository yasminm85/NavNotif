const Display = require('../models/display.model')
const DurationAgenda = require('../models/durationAgenda.model')
const mongoose = require('mongoose');
const GridFSBucket = mongoose.mongo.GridFSBucket;

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
            return res.status(400).json({ message: 'File wajib diupload' });
        }

        const bucket = new GridFSBucket(mongoose.connection.db);

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype
        });

        uploadStream.end(req.file.buffer);

        const displayFileId = await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => resolve(uploadStream.id));
            uploadStream.on('error', reject);
        });

        const display = await Display.create({
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            displayFileId,
            duration: req.body.duration
        });

        res.status(201).json({
            message: 'File uploaded successfully',
            display
        });
    } catch (error) {
        console.error('createMedia error:', error);
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

        if (display.displayFileId) {
            const bucket = new GridFSBucket(mongoose.connection.db);

            await bucket.delete(
                new mongoose.Types.ObjectId(display.displayFileId)
            );
        }

        await Display.findByIdAndDelete(id);

        res.status(200).json({ message: "Media successfully deleted" });
    } catch (error) {
        console.error('deleteMedia error:', error);
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