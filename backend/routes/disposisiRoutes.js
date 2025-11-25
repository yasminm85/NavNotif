const express = require("express");
const router = express.Router();
const {getDisposisi, getDisposisis, createDisposisi} = require('../controllers/disposisiController');

// route all disposisi
router.get('/disposisi', getDisposisi);

// route disposisi specific
router.get('/disposisi/:id', getDisposisis);

//route new disposisi
router.post('/disposisi', createDisposisi);


module.exports = router;