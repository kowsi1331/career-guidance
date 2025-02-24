import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const registerUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/signup`, userData);
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/login`, userData);
};