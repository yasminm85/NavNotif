const Display = require('../models/display.model')
const DurationAgenda = require('../models/durationAgenda.model')

const createMedia = async (req, res) => {
    const display_path = req.file.path;

    if (!display_path) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const fileDetail = {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        path: display_path,
        duration: req.body.duration
    }
    // console.log('File uploaded:', fileDetail);

    const display = await Display.create(fileDetail);

    res.status(200).json({
        message: 'File uploaded successfully',
        display
    });

};

const createAgendaDuration = async (req, res) => {
    try {
        const agenda = await DurationAgenda.create(req.body);
        res.status(200).json(agenda);
    } catch (error) {
        res.status(500).message({ message: error.message});
    }
}

module.exports = {
    createMedia,
    createAgendaDuration
};