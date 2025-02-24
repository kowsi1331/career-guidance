import axios from 'axios';

const API_BASE_URL = 'https://127.0.0.1:5000';

export const registerUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/login`, userData);
};