// routes/thuocRoutes.js
const express = require('express');
const router = express.Router();
const medicController = require('../controllers/medicController');

router.get('/', medicController.getAllMedicines);
router.get('/:id', medicController.getMedicineById);  // Get by ID
router.post('/', medicController.createMedicine);
router.put('/:id', medicController.updateMedicine);    // Update
router.delete('/:id', medicController.softDeleteMedicine);  // Soft Delete

module.exports = router;
