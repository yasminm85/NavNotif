const express = require('express');
const { login, register, logout, getUserDetail } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getUserDetail);


module.exports = router;