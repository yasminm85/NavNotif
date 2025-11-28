const express = require('express');
const { login, register, logout, getUserDetail, getEmployees } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getUserDetail);
router.get('/getEmp', getEmployees);


module.exports = router;