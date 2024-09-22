// services/stockEntryDetailService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/stock-entry-details';

// Get all stock entry details
const getAllStockEntryDetails = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock entry details:', error);
        throw error;
    }
};

const getStockEntryDetailByStockEntryId = async (stockEntryId) => {
    try {
        const response = await axios.get(`${API_URL}/${stockEntryId}/stockEntry`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock entry details:', error);
        throw error;
    }
};

// Create a new stock entry detail
const createStockEntryDetail = async (stockEntryDetailData) => {
    try {
        const response = await axios.post(API_URL, stockEntryDetailData);
        return response.data;
    } catch (error) {
        console.error('Error creating stock entry detail:', error);
        throw error;
    }
};

// Update a stock entry detail
const updateStockEntryDetail = async (stockEntryDetailId, stockEntryDetailData) => {
    try {
        const response = await axios.put(`${API_URL}/${stockEntryDetailId}`, stockEntryDetailData);
        return response.data;
    } catch (error) {
        console.error('Error updating stock entry detail:', error);
        throw error;
    }
};

// Delete a stock entry detail
const deleteStockEntryDetail = async (stockEntryDetailId) => {
    try {
        const response = await axios.delete(`${API_URL}/${stockEntryDetailId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting stock entry detail:', error);
        throw error;
    }
};

const getTotalImportByMonth = async (month,year) => {
    try {
        const response = await axios.get(`${API_URL}/stockEntryByMonth?month=${month}&year=${year}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting stock entry detail:', error);
        throw error;
    }
}

const stockEntryDetailService = {
    deleteStockEntryDetail,
    updateStockEntryDetail,
    createStockEntryDetail,
    getAllStockEntryDetails,
    getStockEntryDetailByStockEntryId,
    getTotalImportByMonth

}

export default stockEntryDetailService;