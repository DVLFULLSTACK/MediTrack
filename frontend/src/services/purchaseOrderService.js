// services/purchaseOrderService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/purchase-orders';

const getPurchaseOrders = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const createPurchaseOrder = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

const purchaseOrderService = {
    createPurchaseOrder,
    getPurchaseOrders
}

export default purchaseOrderService;