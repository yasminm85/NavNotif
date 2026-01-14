const express = require("express");
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware')
const upload_laporan = require('../middleware/uploadFileLaporanMiddleware')
const upload_laporan_tambahan = require('../middleware/uploadFileLaporanTambahanMiddleware')

const { getDisposisi, getDisposisiCount, getDisposisis, createDisposisi, deleteDisposisi, getMyTasks, updateDisposisi, updateLaporan, createKomentar, statsDirektoratTotal, reportTable, updateLaporanTambahan, getUpload } = require('../controllers/disposisiController');

// route all disposisi
router.get('/disposisi', getDisposisi);

router.get('/disposisi/my', verifyToken, authorizationRoles('pegawai', 'admin'),  getMyTasks);

// hitung total disposisi
router.get('/disposisi/count', verifyToken, authorizationRoles('admin'), getDisposisiCount);

//route bar chart
router.get('/disposisi/barchart', statsDirektoratTotal);

// route report table bawahnya si bar chart
router.get('/disposisi/report-table', reportTable);

//route new disposisi
router.post('/disposisi', verifyToken, authorizationRoles('admin'), upload.single('file'), createDisposisi);

// create dan update laporan
router.patch('/disposisi/:id/laporan', verifyToken, authorizationRoles('pegawai', 'admin'), upload_laporan.single('laporan_file_path'), updateLaporan);

// create dan update laporan tambahan
router.patch('/disposisi/:id/laporan-tambahan', verifyToken, authorizationRoles('pegawai', 'admin'), upload_laporan_tambahan.single('laporan_tambahan_path'), updateLaporanTambahan);

// nambahin komentar
router.patch('/disposisi/:id/komentar', verifyToken, authorizationRoles('EVP'), createKomentar);

// route disposisi specific
router.get('/disposisi/:id', verifyToken, authorizationRoles('admin'), getDisposisis);

// delete disposisi
router.delete('/disposisi/:id', verifyToken, authorizationRoles('admin'), deleteDisposisi);

// update disposisi
router.patch('/disposisi/:id', verifyToken, authorizationRoles('admin'), upload.single('file'),updateDisposisi);

// get upload pdf 
router.get('/file/:id', getUpload);

module.exports = router;

