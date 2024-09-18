// services/thuocService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/medics';

const getAllMedicines = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getMedicineById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const createMedicine = async (medicineData) => {
    const response = await axios.post(API_URL, medicineData);
    return response.data;
};

const updateMedicine = async (id, medicineData) => {
    const response = await axios.put(`${API_URL}/${id}`, medicineData);
    return response.data;
};

const softDeleteMedicine = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

const medicService = {
    softDeleteMedicine,
    updateMedicine,
    createMedicine,
    getAllMedicines,
    getMedicineById,
    
}

export default medicService;