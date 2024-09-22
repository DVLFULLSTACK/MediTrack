// routes/stockEntryDetailRoutes.js
const express = require('express');
const router = express.Router();
const stockEntryDetailController = require('../controllers/stockEntryDetailController');

// Define routes for stock entry details
router.get('/stockEntryByMonth', stockEntryDetailController.getTotalImportByMonth);
router.get('/', stockEntryDetailController.getAllStockEntryDetails);
router.post('/', stockEntryDetailController.createStockEntryDetail);
router.get('/:stockEntryId/stockEntry', stockEntryDetailController.getStockEntryDetailByStockEntryId);
router.get('/:stockEntryDetailId', stockEntryDetailController.getStockEntryDetailById);
router.put('/:stockEntryDetailId', stockEntryDetailController.updateStockEntryDetail);
router.delete('/:stockEntryDetailId', stockEntryDetailController.deleteStockEntryDetail);

module.exports = router;
