// services/nhaCungCapService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/suppliers';

const getAllSuppliers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getSupplierById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const createSupplier = async (supplierData) => {
    const response = await axios.post(API_URL, supplierData);
    return response.data;
};

const updateSupplier = async (id, supplierData) => {
    const response = await axios.put(`${API_URL}/${id}`, supplierData);
    return response.data;
};

const softDeleteSupplier = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

const supplierService = {
    softDeleteSupplier,
    updateSupplier,
    createSupplier,
    getAllSuppliers,
    getSupplierById
}

export default supplierService;