// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);  // Get by ID
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);    // Update
router.delete('/:id', userController.softDeleteUser);  // Soft Delete

module.exports = router;
