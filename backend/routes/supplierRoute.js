// routes/nhaCungCapRoutes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);  // Get by ID
router.post('/', supplierController.createSupplier);
router.put('/:id', supplierController.updateSupplier);    // Update
router.delete('/:id', supplierController.softDeleteSupplier);  // Soft Delete

module.exports = router;