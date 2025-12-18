const express = require("express");
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware')
const upload_laporan = require('../middleware/uploadFileLaporanMiddleware')

const { getDisposisi, getDisposisiCount, getDisposisis, createDisposisi, deleteDisposisi, getMyTasks, updateDisposisi, updateLaporan, createKomentar, statsDirektoratTotal } = require('../controllers/disposisiController');

// route all disposisi
router.get('/disposisi', verifyToken, authorizationRoles('admin', 'EVP'), getDisposisi);

router.get('/disposisi/my', verifyToken, authorizationRoles('pegawai', 'admin'),  getMyTasks);

// hitung total disposisi
router.get('/disposisi/count', verifyToken, authorizationRoles('admin'), getDisposisiCount);

router.get('/disposisi/barchar', statsDirektoratTotal);

//route new disposisi
router.post('/disposisi', verifyToken, authorizationRoles('admin'), upload.single('file'), createDisposisi);

// route disposisi specific
router.get('/disposisi/:id', verifyToken, authorizationRoles('admin'), getDisposisis);

// delete disposisi
router.delete('/disposisi/:id', verifyToken, authorizationRoles('admin'), deleteDisposisi);

// update disposisi
router.patch('/disposisi/:id', verifyToken, authorizationRoles('admin'), upload.single('file'),updateDisposisi);

// update laporan
router.patch('/disposisi/:id/laporan', verifyToken, authorizationRoles('pegawai', 'admin'), upload_laporan.single('laporan_file_path'), updateLaporan);

// nambahin komentar
router.patch('/disposisi/:id/komentar', verifyToken, authorizationRoles('EVP'), createKomentar);



module.exports = router;

