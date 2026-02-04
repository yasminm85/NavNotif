const TindakLanjut = require('../models/tindaklanjut.model')
const mongoose = require('mongoose');
const GridFSBucket = mongoose.mongo.GridFSBucket;

// mendapatkan data 
const getTindakLanjut = async (req, res) => {
    try {
        const tindaklanjut = await TindakLanjut.find().populate("personil_yang_dituju", "name").sort({ createdAt: -1 });
        res.status(200).json(tindaklanjut);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createTindakLanjut = async (req, res) => {
    try {
        const bucket = new GridFSBucket(mongoose.connection.db);

        const uploadToGridFS = (file) =>
            new Promise((resolve, reject) => {
                const stream = bucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype
                });
                stream.end(file.buffer);
                stream.on('finish', () => resolve(stream.id));
                stream.on('error', reject);
            });

        let fileArahanId = [];

        if (req.files?.file_arahan) {
            for (const file of req.files.file_arahan) {
                const fileId = await uploadToGridFS(file);
                fileArahanId.push(fileId);
            }
        }

        const personil_yang_dituju = req.body.personil_yang_dituju ? JSON.parse(req.body.personil_yang_dituju) : [];

        const tindaklanjut = await TindakLanjut.create({
            personil_yang_dituju,
            judul_arahan: req.body.judul_arahan,
            isi_arahan: req.body.isi_arahan,
            file_arahan: fileArahanId,
        });

        const tindaklanjutId = await TindakLanjut.findById(tindaklanjut._id)
            .populate("personil_yang_dituju", "name")
        res.status(200).json(tindaklanjutId);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateTindakLanjut = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul_tindaklanjut } = req.body;
        const { isi_tindaklanjut } = req.body;
        const userId = req.user?._id || req.user?.id;
        
        console.log(userId);

        let query = { _id: id, personil_yang_dituju: userId };


        const tindaklanjut = await TindakLanjut.findOne(query);

        if (!tindaklanjut) {
            return res.status(404).json({ message: 'Tindak Lanjut Tidak Ditemukan' });
        }

        const bucket = new GridFSBucket(mongoose.connection.db);

        const uploadToGridFS = (file) =>
            new Promise((resolve, reject) => {
                const stream = bucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype
                });
                stream.end(file.buffer);
                stream.on('finish', () => resolve(stream.id));
                stream.on('error', reject);
        });
        
            let fileTindakLanjutId = [];

            if (req.files?.file_tindaklanjut) {
            for (const file of req.files.file_tindaklanjut) {
                const fileId = await uploadToGridFS(file);
                fileTindakLanjutId.push(fileId);
            }
        }

        tindaklanjut.judul_tindaklanjut = judul_tindaklanjut;
        tindaklanjut.isi_tindaklanjut = isi_tindaklanjut;
        tindaklanjut.file_tindaklanjut = fileTindakLanjutId;
        tindaklanjut.isTindakLanjut = true;

        await tindaklanjut.save();

        const populated = await TindakLanjut.findById(tindaklanjut._id)
            .populate('personil_yang_dituju', 'name');
        
        res.json({
            message: 'Tindak Lanjut Telah Berhasil Diisi',
            tindaklanjut: populated
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getMyArahan = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const arahanList = await TindakLanjut.find({
            personil_yang_dituju: userId
        })
            .populate("personil_yang_dituju", "name email")
            .sort({ tanggal: -1 });

        res.json(arahanList);
    } catch (error) {
        console.error('Error getMyTasks:', error);
        res.status(500).json({ message: error.message });
    }
};

const getFile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid file id');
        }

        const bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db
        );

        const fileId = new mongoose.Types.ObjectId(id);

        const files = await mongoose.connection.db
            .collection('fs.files')
            .find({ _id: fileId })
            .toArray();

        if (!files || files.length === 0) {
            return res.status(404).send('File not found');
        }

        const file = files[0];

        res.set({
            'Content-Type': file.contentType || 'application/octet-stream',
            'Content-Disposition': 'inline'
        });

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', () => {
            res.status(404).send('File not found');
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving file');
    }
};


module.exports =
{
    getTindakLanjut,
    createTindakLanjut,
    updateTindakLanjut,
    getMyArahan,
    getFile
}

