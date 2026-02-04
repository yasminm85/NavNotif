const express = require("express");
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const router = express.Router();
const upload_file_arahan = require('../middleware/uploadFileArahan');
const upload_file_tindaklanjut = require('../middleware/uploadPatchTindakLanjut')
const { getTindakLanjut, createTindakLanjut, updateTindakLanjut, getMyArahan, getFile } = require('../controllers/tindaklanjutController')

router.get('/get-tindaklanjut', getTindakLanjut);
router.get('/get-arahan', verifyToken, authorizationRoles('pegawai', 'admin'), getMyArahan);
router.post('/create-tindaklanjut', upload_file_arahan, createTindakLanjut);
router.patch('/update/:id/tindaklanjut', verifyToken, authorizationRoles('pegawai', 'admin'),upload_file_tindaklanjut, updateTindakLanjut);
router.get('/file_tindak/:id', getFile);


module.exports = router;
