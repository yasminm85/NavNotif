const Disposisi = require('../models/disposisi.model')
const Notification = require('../models/notif.model')
const Direktorat = require('../models/direktorat.model')
const Divisi = require('../models/divisi.model')
const mongoose = require('mongoose');
const GridFSBucket = mongoose.mongo.GridFSBucket;


//get all disposisi
const getDisposisi = async (req, res) => {
    try {
        const disposisi = await Disposisi.find()
            .populate("nama_yang_dituju", "name")
            .populate("laporan_by", "name email")
            .populate("laporan_tambahan_by", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// hitung total dispo dibuat
const getDisposisiCount = async (req, res) => {
    // console.log("User from token:", req.user);
    try {
        const total = await Disposisi.countDocuments();
        res.status(200).json({ total });
    } catch (error) {
        console.error("ERROR getDisposisiCount:", error);
        res.status(500).json({ message: "Gagal menghitung disposisi", error: error.message });
    }
};

//get disposisi by id
const getDisposisis = async (req, res) => {
    try {
        const { id } = req.params;
        const disposisi = await Disposisi.findById(id);
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//membuat disposisi
const REMINDER_OFFSET_MINUTES = {
    REMINDER_1H: -60,
    REMINDER_30M: -30
};

const createDisposisi = async (req, res) => {
    try {
        let fileId = null;

        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db);

            const uploadStream = bucket.openUploadStream(req.file.originalname, {
                contentType: req.file.mimetype
            });

            uploadStream.end(req.file.buffer);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => {
                    fileId = uploadStream.id;
                    resolve();
                });
                uploadStream.on('error', reject);
            });
        }

        const nama_yang_dituju = req.body.nama_yang_dituju ? JSON.parse(req.body.nama_yang_dituju) : [];
        const direktorat = req.body.direktorat ? JSON.parse(req.body.direktorat) : [];
        const divisi = req.body.divisi ? JSON.parse(req.body.divisi) : [];
        const ruangan = req.body.ruangan || "";
        console.log(fileId);

        let notificationOptions = [];
        try {
            if (Array.isArray(req.body.notificationOptions)) {
                notificationOptions = req.body.notificationOptions;
            } else if (typeof req.body.notificationOptions === 'string' && req.body.notificationOptions.trim()) {
                try {
                    notificationOptions = JSON.parse(req.body.notificationOptions);
                } catch {
                    notificationOptions = req.body.notificationOptions;
                }
            }
        } catch (e) {
            notificationOptions = [];
        }

        if (!Array.isArray(notificationOptions)) {
            notificationOptions = notificationOptions ? [String(notificationOptions).trim()] : [];
        } else {
            notificationOptions = notificationOptions.map((x) => String(x).trim());
        }

        // console.log('tangggal:', req.body.tanggal);
        // console.log('jam_mulai:', req.body.jam_mulai);
        // console.log('notificationOptions rw:', req.body.notificationOptions);
        // console.log('notificationOptions nrml:', notificationOptions);

        const disposisi = await Disposisi.create({
            nama_kegiatan: req.body.nama_kegiatan,
            agenda_kegiatan: req.body.agenda_kegiatan,
            nama_yang_dituju,
            direktorat,
            divisi,
            tanggal: req.body.tanggal,
            jam_mulai: req.body.jam_mulai,
            jam_selesai: req.body.jam_selesai,
            tempat: req.body.tempat,
            ruangan,
            fileId,
            catatan: req.body.catatan,
            dresscode: req.body.dresscode,
            notificationOptions
        });

        let notifDocs = [];

        if (Array.isArray(nama_yang_dituju) && nama_yang_dituju.length > 0) {
            const now = new Date();

            notifDocs = nama_yang_dituju.map((userId) => ({
                disposisi: disposisi._id,
                user: userId,
                notifType: 'ON_CREATE',
                sendAt: now,
                isDone: false
            }));

            if (notificationOptions.length > 0) {
                const eventDate = new Date(req.body.jam_mulai);

                if (!isNaN(eventDate.getTime())) {
                    const uniqueOptions = [...new Set(notificationOptions)];
                    const reminderDocs = [];

                    uniqueOptions.forEach((optKey) => {
                        const offset = REMINDER_OFFSET_MINUTES[optKey];
                        if (offset === undefined) return;

                        const reminderTime = new Date(eventDate.getTime() + offset * 60 * 1000);
                        if (isNaN(reminderTime.getTime())) return;

                        nama_yang_dituju.forEach((userId) => {
                            reminderDocs.push({
                                disposisi: disposisi._id,
                                user: userId,
                                notifType: optKey,
                                sendAt: reminderTime,
                                isDone: false
                            });
                        });
                    });

                    notifDocs = notifDocs.concat(reminderDocs);
                } else {
                    console.log('Invalid Jam Mulai', {
                        jam_mulai: req.body.jam_mulai
                    });
                }
            }

            if (notifDocs.length > 0) {
                await Notification.insertMany(notifDocs);
            }
        }

        const disposisiId = await Disposisi.findById(disposisi._id)
            .populate("nama_yang_dituju", "name")
            .populate("laporan_by", "name email")
            .populate("laporan_tambahan_by", "name email");

        res.status(200).json(disposisiId);

    } catch (error) {
        console.error('createDisposisi error:', error);
        res.status(500).json({ message: error.message });
    }
};


//upate disposisi
const updateDisposisi = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nama_kegiatan,
            agenda_kegiatan,
            nama_yang_dituju,
            direktorat,
            divisi,
            tanggal,
            jam_mulai,
            jam_selesai,
            tempat,
            ruangan,
            catatan,
            dresscode,
            file_path
        } = req.body;

        const updateData = {};

        if (nama_kegiatan !== undefined) updateData.nama_kegiatan = nama_kegiatan;
        if (agenda_kegiatan !== undefined) updateData.agenda_kegiatan = agenda_kegiatan;
        if (nama_yang_dituju) updateData.nama_yang_dituju = JSON.parse(nama_yang_dituju);
        if (direktorat) updateData.direktorat = JSON.parse(direktorat);
        if (divisi) updateData.divisi = JSON.parse(divisi);

        if (tanggal) updateData.tanggal = tanggal;
        if (jam_mulai) updateData.jam_mulai = jam_mulai;
        if (jam_selesai === "") {
            updateData.jam_selesai = "";
        } else if (jam_selesai !== undefined) {
            updateData.jam_selesai = jam_selesai;
        }

        if (tempat !== undefined) updateData.tempat = tempat;
        if (ruangan !== undefined) updateData.ruangan = ruangan;
        if (catatan !== undefined) updateData.catatan = catatan;
        if (dresscode !== undefined) updateData.dresscode = dresscode;

        if (req.file) {
            updateData.file_path = req.file.path;
        } else if (file_path) {
            updateData.file_path = file_path;
        }

        const updatedDisposisi = await Disposisi.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedDisposisi) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        res.status(200).json(updatedDisposisi);

    } catch (error) {
        console.error('Error updateDisposisi:', error);
        res.status(500).json({ message: error.message });
    }
};

//delete disposisi
const deleteDisposisi = async (req, res) => {
    try {
        const { id } = req.params;

        const disposisi = await Disposisi.findByIdAndDelete(id);

        if (!disposisi) {
            return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json({ message: "Data successfully delete" })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// dapatin dispo sesuai dengan akun masung-masing
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const disposisiList = await Disposisi.find({
            nama_yang_dituju: userId
        })
            .populate("nama_yang_dituju", "name email")
            .populate("laporan_by", "name email")
            .populate("laporan_tambahan_by", "name email")
            .sort({ tanggal: -1 });

        res.json(disposisiList);
    } catch (error) {
        console.error('Error getMyTasks:', error);
        res.status(500).json({ message: error.message });
    }
};

// buat bikin dan update laporan
const updateLaporan = async (req, res) => {
    try {
        const { id } = req.params;
        const { laporan } = req.body;
        const userId = req.user.id || req.user._id;
        const userRole = req.user.role;

        if (!laporan || !laporan.trim()) {
            return res.status(400).json({ message: 'Laporan tidak boleh kosong' });
        }

        let query = { _id: id, nama_yang_dituju: userId };
        if (userRole === 'admin') query = { _id: id };

        const disposisi = await Disposisi.findOne(query);
        if (!disposisi) {
            return res.status(404).json({ message: 'Disposisi tidak ditemukan' });
        }

        let laporanFileId = null;

        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db);

            const uploadStream = bucket.openUploadStream(req.file.originalname, {
                contentType: req.file.mimetype
            });

            uploadStream.end(req.file.buffer);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => {
                    laporanFileId = uploadStream.id;
                    resolve();
                });
                uploadStream.on('error', reject);
            });
        }

        disposisi.laporan = laporan;
        disposisi.laporanFileId = laporanFileId;
        disposisi.laporan_by = userId;
        disposisi.laporan_status = 'SUDAH';
        disposisi.laporan_at = new Date();

        await disposisi.save();

        const populated = await Disposisi.findById(disposisi._id)
            .populate('nama_yang_dituju', 'name email')
            .populate('laporan_by', 'name email');

        res.json({
            message: 'Laporan berhasil disimpan',
            disposisi: populated
        });
    } catch (error) {
        console.error('updateLaporan error:', error);
        res.status(500).json({ message: error.message });
    }
};


//buat laporan tambahan
const updateLaporanTambahan = async (req, res) => {
    try {
        const { id } = req.params;
        const { laporan_tambahan } = req.body;
        const userId = req.user.id || req.user._id;
        const userRole = req.user.role;

        if (!laporan_tambahan || !laporan_tambahan.trim()) {
            return res.status(400).json({ message: 'Laporan Tambahan tidak boleh kosong' });
        }

        let query = { _id: id, nama_yang_dituju: userId };

        if (userRole === 'admin') {
            query = { _id: id };
        }

        const disposisi = await Disposisi.findOne(query);

        if (!disposisi) {
            return res.status(404).json({
                message:
                    'Disposisi tidak ditemukan'
            });
        }

        let laporanFileTambahanId = null;

        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db);

            const uploadStream = bucket.openUploadStream(req.file.originalname, {
                contentType: req.file.mimetype
            });

            uploadStream.end(req.file.buffer);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => {
                    laporanFileTambahanId = uploadStream.id;
                    resolve();
                });
                uploadStream.on('error', reject);
            });
        }

        disposisi.laporan_tambahan = laporan_tambahan;
        disposisi.laporan_tambahan_by = userId
        disposisi.laporanFileTambahanId = laporanFileTambahanId;
        disposisi.laporan_tambahan_at = new Date();
        disposisi.laporan_tambahan_status = 'SUDAH';

        await disposisi.save();

        const populated = await Disposisi.findById(disposisi._id)
            .populate('nama_yang_dituju', 'name email')
            .populate('laporan_tambahan_by', 'name email');

        console.log('populated laporan_tambahan_by:', populated.laporan_tambahan_by);

        res.json({
            message: 'Laporan tambahan berhasil disimpan',
            disposisi: populated
        });
    } catch (error) {
        console.error('updateLaporanTambahan error:', error);
        res.status(500).json({ message: error.message });
    }
};

// menambahkan komentar
const createKomentar = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        console.log(text);
        console.log(req.body);
        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Komentar tidak boleh kosong" });
        }

        const disposisi = await Disposisi.findById(id);
        if (!disposisi) {
            return res.status(404).json({ message: "Disposisi tidak ditemukan" });
        }

        disposisi.komentar = text;

        await disposisi.save();

        const populated = await Disposisi.findById(id)
            .populate('nama_yang_dituju', 'name email')
            .populate("laporan_by", "name email");

        res.json({ message: "Komentar tersimpan", disposisi: populated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// buat di bar-chart total kegiatan sesuai direktorat
const statsDirektoratTotal = async (req, res) => {
    try {
        const [rows, direktoratList, divisiList] = await Promise.all([
            Disposisi.aggregate([
                { $unwind: '$direktorat' },
                {
                    $group: {
                        _id: '$direktorat',
                        total: { $sum: 1 }
                    }
                }
            ]),
            Direktorat.find().sort({ order: 1 }).lean(),
            Divisi.find().sort({ order: 1 }).lean()
        ]);

        const map = new Map(rows.map(r => [r._id, r]));
        const categories = direktoratList.map(d => d._id);
        const totalData = categories.map(id => map.get(id)?.total ?? 0);

        res.json({
            categories,
            series: [{ name: 'Total Kegiatan', data: totalData }],
            direktoratOptions: direktoratList.map(d => ({ id: d._id, name: d.name })),
            divisiOptions: divisiList.map(v => ({ id: v._id, name: v.name, direktoratId: v.direktoratId }))
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// buat di table report bawahnya bar-chart
const reportTable = async (req, res) => {
    try {
        const { month, year } = req.query;

        let matchStage = {};

        if (year && month) {
            const y = Number(year);
            const m = Number(month);

            const startDate = new Date(y, m - 1, 1, 0, 0, 0, 0);
            const endExclusive = new Date(y, m, 1, 0, 0, 0, 0);

            matchStage.tanggal = { $gte: startDate, $lt: endExclusive };
        } else if (year) {
            const y = Number(year);
            const startDate = new Date(y, 0, 1, 0, 0, 0, 0);
            const endExclusive = new Date(y + 1, 0, 1, 0, 0, 0, 0);

            matchStage.tanggal = { $gte: startDate, $lt: endExclusive };
        }

        const now = new Date();

        const pipeline = [
            ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
            {
                $addFields: {
                    isPastOrToday: { $lte: ['$tanggal', now] }
                }
            },
            { $unwind: '$direktorat' },
            { $unwind: '$divisi' },
            {
                $group: {
                    _id: { dir: '$direktorat', div: '$divisi' },
                    totalKegiatan: { $sum: 1 },

                    belumMelapor: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        '$isPastOrToday',
                                        { $eq: ['$laporan_status', 'BELUM'] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    sudahMelapor: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        '$isPastOrToday',
                                        { $ne: ['$laporan_status', 'BELUM'] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    belumMengikuti: {
                        $sum: { $cond: [{ $not: ['$isPastOrToday'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    direktoratId: '$_id.dir',
                    divisiId: '$_id.div',
                    totalKegiatan: 1,
                    belumMelapor: 1,
                    sudahMelapor: 1,
                    belumMengikuti: 1
                }
            }
        ];

        const [rows, direktoratList, divisiList] = await Promise.all([
            Disposisi.aggregate(pipeline),
            Direktorat.find().sort({ order: 1 }).lean(),
            Divisi.find().sort({ order: 1 }).lean()
        ]);

        const statsMap = new Map(rows.map(r => [`${r.direktoratId}__${r.divisiId}`, r]));

        // nampilin dari seed buat direktorat dan divisi
        const data = direktoratList.map(dir => {
            const divisiByDir = divisiList.filter(v => v.direktoratId === dir._id);

            return {
                id: dir._id,
                direktorat: dir.name,
                expanded: true,
                divisi: divisiByDir.map(div => {
                    const key = `${dir._id}__${div._id}`;
                    const stat = statsMap.get(key);

                    return {
                        id: div._id,
                        nama: div.name,
                        totalKegiatan: stat?.totalKegiatan ?? 0,
                        sudahMelaporkan: stat?.sudahMelapor ?? 0,
                        belumMelaporkan: stat?.belumMelapor ?? 0,
                        belumMengikuti: stat?.belumMengikuti ?? 0
                    };
                })
            };
        });

        return res.json({ data });
    } catch (err) {
        console.error('Error reportTable:', err);
        return res.status(500).json({ message: err.message });
    }
};

const getUpload = async (req, res) => {
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



module.exports = {
    getDisposisi,
    getDisposisiCount,
    getDisposisis,
    createDisposisi,
    updateDisposisi,
    deleteDisposisi,
    getMyTasks,
    updateLaporan,
    createKomentar,
    statsDirektoratTotal,
    reportTable,
    updateLaporanTambahan,
    getUpload
};


