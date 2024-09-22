// services/purchaseOrderDetailService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/purchase-order-details';

const getPurchaseOrderDetails = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getTopSelling = async () => {
    const response = await axios.get(`${API_URL}/top-sell`);
    return response.data;
};

const getByYear = async (year) => {
    const response = await axios.get(`${API_URL}/year/${year}`);
    return response.data;
};

const createPurchaseOrderDetail = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

const purchaseOrderDetailService = {
    getPurchaseOrderDetails,
    createPurchaseOrderDetail,
    getTopSelling,
    getByYear
}
export default purchaseOrderDetailService;