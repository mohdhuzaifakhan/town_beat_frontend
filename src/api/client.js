import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    // baseURL: 'https://52djbtmx-3000.inc1.devtunnels.ms/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
