const Disposisi = require('../models/disposisi.model')
const Notification = require('../models/notif.model')

//get all disposisi
const getDisposisi = async (req, res) => {
    try {
        const disposisi = await Disposisi.find()
            .populate("nama_yang_dituju", "name")
            .populate("laporan_by", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDisposisiCount = async (req, res) => {
    console.log("User from token:", req.user);
    try {
        const total = await Disposisi.countDocuments();
        res.status(200).json({ total });
    } catch (error) {
        console.error("ERROR getDisposisiCount:", error);
        res.status(500).json({ message: "Gagal menghitung disposisi", error: error.message });
    }
};

//get disposisi specific
const getDisposisis = async (req, res) => {
    try {
        const { id } = req.params;
        const disposisi = await Disposisi.findById(id);
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//create new disposisi
const createDisposisi = async (req, res) => {
    try {
        const filePath = req.file ? req.file.path : null;
        console.log(req.body.file);

        const nama_yang_dituju = req.body.nama_yang_dituju ? JSON.parse(req.body.nama_yang_dituju) : [];

        const direktorat = req.body.direktorat ? JSON.parse(req.body.direktorat) : [];

        const divisi = req.body.divisi ? JSON.parse(req.body.divisi) : [];

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
            catatan: req.body.catatan,
            dresscode: req.body.dresscode,
            file_path: filePath,
        });

        if (Array.isArray(nama_yang_dituju) && nama_yang_dituju.length > 0) {
            const notifDocs = nama_yang_dituju.map((userId) => ({
                disposisi: disposisi._id,
                user: userId,
            }));

            await Notification.insertMany(notifDocs);
        }

        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
        // if (jam_selesai) updateData.jam_selesai = jam_selesai;
        if (jam_selesai === "") {
            updateData.jam_selesai = "";     // reset jadi kosong
        } else if (jam_selesai !== undefined) {
            updateData.jam_selesai = jam_selesai; // update normal
        }

        if (tempat !== undefined) updateData.tempat = tempat;
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

const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const disposisiList = await Disposisi.find({
            nama_yang_dituju: userId
        })
            .populate("nama_yang_dituju", "name email")
            .populate("laporan_by", "name email")
            .sort({ tanggal: -1 });

        res.json(disposisiList);
    } catch (error) {
        console.error('Error getMyTasks:', error);
        res.status(500).json({ message: error.message });
    }
};

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

        if (userRole === 'admin') {
            query = { _id: id };
        }

        const disposisi = await Disposisi.findOne(query);

        if (!disposisi) {
            return res.status(404).json({
                message:
                    'Disposisi tidak ditemukan atau Anda tidak berhak mengisi laporan untuk surat ini'
            });
        }

        disposisi.laporan = laporan;
        disposisi.laporan_status = 'SUDAH';
        disposisi.laporan_by = userId;
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





module.exports = {
    getDisposisi,
    getDisposisiCount,
    getDisposisis,
    createDisposisi,
    updateDisposisi,
    deleteDisposisi,
    getMyTasks,
    updateLaporan
};


