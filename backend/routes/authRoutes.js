const express = require('express');
const { login, register, logout, getUserDetail, getEmployees, getUserById, deleteUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getUserDetail);
router.get('/getEmp', getEmployees);
router.get('/getUser/:id', getUserById);
router.delete('/delete/user/:id', deleteUser);



module.exports = router;