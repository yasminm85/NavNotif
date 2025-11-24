const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
const authorizationRoles = require('../middleware/roleMiddleware');

//admin
router.get('/admin', verifyToken, authorizationRoles("admin"), (req, res) => {
    res.json({message: "Selamat datang Admin"});
});

//pegawai
router.get('/pegawai', verifyToken, authorizationRoles("pegawai"),(req, res) => {
    res.json({message: "Selamat Datang"});
});


module.exports = router;