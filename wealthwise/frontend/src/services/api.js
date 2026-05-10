import axios from "axios";

// Investor API — uses investor token
const API = axios.create({
    baseURL: "http://localhost:8080"
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Admin API — uses admin token separately
export const ADMIN_API = axios.create({
    baseURL: "http://localhost:8080"
});

ADMIN_API.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken"); // admin token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default API;