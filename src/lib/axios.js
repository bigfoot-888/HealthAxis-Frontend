import axiosImport from 'axios';

export const axios = axiosImport.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor (auth, tracing)
axios.interceptors.request.use((config) => {
    config.headers['X-Request-ID'] = crypto.randomUUID();
    return config;
});

// Response interceptor (explicit error handling)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Centralized logging
        console.error('API error', error);
        return Promise.reject(error);
    },
);
