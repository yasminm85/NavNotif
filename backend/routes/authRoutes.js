const express = require('express');
const { login, register, logout, getUserDetail, getEmployees, getUserById, getAllUser,deleteUser, updateUser } = require('../controllers/authController');
const router = express.Router();

// route register
router.post('/register', register);

// route login
router.post('/login', login);

// route logout
router.post('/logout', logout);

// route masing-masing user
router.get('/me', getUserDetail);

// route get hanya pegawai
router.get('/getEmp', getEmployees);

//route semua user
router.get('/getAll', getAllUser)

// route user by id
router.get('/getUser/:id', getUserById);

//update user 
router.patch('/update/user/:id', updateUser);

// route delete user
router.delete('/delete/user/:id', deleteUser);




module.exports = router;