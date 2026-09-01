import axios from 'axios';

export const getBackendUrl = () => {
    const rawUrl = import.meta.env.VITE_backend_URL || import.meta.env.VITE_API_URL;
    if (rawUrl) {
        if (typeof window !== 'undefined' && window.location && window.location.hostname) {
            const hostname = window.location.hostname;
            if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                return rawUrl.replace(/localhost|127\.0\.0\.1/, hostname);
            }
        }
        return rawUrl;
    }
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        return `http://${window.location.hostname}:3000`;
    }
    return 'http://localhost:3000';
};

const axiosInstance = axios.create({
    baseURL: getBackendUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    config.baseURL = getBackendUrl();
    return config;
});

export default axiosInstance;