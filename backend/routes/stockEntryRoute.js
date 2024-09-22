// routes/stockEntryRoutes.js
const express = require('express');
const router = express.Router();
const stockEntryController = require('../controllers/stockEntryController');

// Define routes for stock entries
router.get('/', stockEntryController.getAllStockEntries);
router.post('/', stockEntryController.createStockEntry);
router.get('/:stockEntryId', stockEntryController.getStockEntryById);
router.put('/:stockEntryId', stockEntryController.updateStockEntry);
router.delete('/:stockEntryId', stockEntryController.deleteStockEntry);

module.exports = router;
