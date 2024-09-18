// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const loginUser = async (loginData) => {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
};

const authService = {
    loginUser,
    registerUser
}

export default authService;