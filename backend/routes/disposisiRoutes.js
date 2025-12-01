const express = require("express");
const verifyToken = require('../middleware/authMiddleware');
const authorizationRoles = require('../middleware/roleMiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware')

const { getDisposisi, getDisposisis, createDisposisi, deleteDisposisi, getMyTasks } = require('../controllers/disposisiController');

// route all disposisi
router.get('/disposisi', verifyToken, authorizationRoles("admin"), getDisposisi);

// route disposisi specific
router.get('/disposisi/:id', verifyToken, authorizationRoles("admin"), getDisposisis);

//route new disposisi
router.post('/disposisi', verifyToken, authorizationRoles("admin"), upload.single("file"), createDisposisi);

// delete disposisi
router.delete('/disposisi/:id', verifyToken, authorizationRoles("admin"), deleteDisposisi);

router.get('/disposisi/my', verifyToken, authorizationRoles('pegawai', 'admin'),  getMyTasks);



module.exports = router;