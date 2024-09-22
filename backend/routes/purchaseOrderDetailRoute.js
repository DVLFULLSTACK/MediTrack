// routes/purchaseOrderDetailRoutes.js
const express = require('express');
const router = express.Router();
const purchaseOrderDetailController = require('../controllers/purchaseOrderDetailController');

router.get('/', purchaseOrderDetailController.getPurchaseOrderDetails);
router.post('/', purchaseOrderDetailController.createPurchaseOrderDetail);
router.get('/top-sell/',purchaseOrderDetailController.getTopSelling)
router.get('/year/:year',purchaseOrderDetailController.statisticByYear)


module.exports = router;
