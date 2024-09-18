// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);  // Đăng ký
router.post('/login', authController.login);        // Đăng nhập

module.exports = router;