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

// Response interceptor to handle session invalidation (401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Boot user back to the login page if they are unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
