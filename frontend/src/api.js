import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        return { success: false, error: error.response?.data?.error || "Something went wrong!" };
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, userData);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        return { success: false, error: error.response?.data?.error || "Invalid credentials!" };
    }
};
