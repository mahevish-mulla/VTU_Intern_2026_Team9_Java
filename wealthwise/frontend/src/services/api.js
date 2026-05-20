import axios from "axios";

// Update this with your actual hosted backend URL (e.g., from Railway)
const BACKEND_URL = "https://wealthwise-35qy.onrender.com"; 

// Investor API
const API = axios.create({
    baseURL: BACKEND_URL
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Admin API
export const ADMIN_API = axios.create({
    baseURL: BACKEND_URL
});

ADMIN_API.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
