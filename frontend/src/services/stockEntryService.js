// services/stockEntryService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/stock-entries';

// Get all stock entries
const getAllStockEntries = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock entries:', error);
        throw error;
    }
};

// Create a new stock entry
const createStockEntry = async (stockEntryData) => {
    try {
        const response = await axios.post(API_URL, stockEntryData);
        return response.data;
    } catch (error) {
        console.error('Error creating stock entry:', error);
        throw error;
    }
};

// Update a stock entry
const updateStockEntry = async (stockEntryId, stockEntryData) => {
    try {
        const response = await axios.put(`${API_URL}/${stockEntryId}`, stockEntryData);
        return response.data;
    } catch (error) {
        console.error('Error updating stock entry:', error);
        throw error;
    }
};

// Delete a stock entry
const deleteStockEntry = async (stockEntryId) => {
    try {
        const response = await axios.delete(`${API_URL}/${stockEntryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting stock entry:', error);
        throw error;
    }
};

const stockEntryService = {
    deleteStockEntry,
    updateStockEntry,
    createStockEntry,
    getAllStockEntries
}

export default stockEntryService;