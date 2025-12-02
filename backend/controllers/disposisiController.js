const Disposisi = require('../models/disposisi.model')

//get all disposisi
const getDisposisi = async (req, res) => {
    try {
        const disposisi = await Disposisi.find()
        .populate("nama_yang_dituju", "name")
        .sort({ createdAt: -1});
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({message: error.message});
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
        res.status(500).json({message: error.message});
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
            file_path: filePath

        });
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//upate disposisi
const updateDisposisi = async (req, res) => {
    try {
        const { id } = req.params;

        const disposisi = await Disposisi.findByIdAndUpdate(id, req.body);

        if(!disposisi) {
            return res.status(404).json({message: "Data tidak ditemukan"});
        }
        const updatedDisposisi = await Disposisi.findById(id);
        res.status(200).json(updatedDisposisi);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//delete disposisi
const deleteDisposisi = async (req, res) => {
    try {
        const { id } = req.params;

        const disposisi = await Disposisi.findByIdAndDelete(id);

        if(!disposisi) {
            return res.status(404).json({message: "Data not found"});
        }

        res.status(200).json({message: "Data successfully delete"})

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; 

    const disposisiList = await Disposisi.find({
      nama_yang_dituju: userId   
    })
      .sort({ tanggal: -1 }); 

    res.json(disposisiList);
  } catch (error) {
    console.error('Error getMyTasks:', error);
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
    getMyTasks
};