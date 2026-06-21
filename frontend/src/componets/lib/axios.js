import axios from 'axios';

const BaseURL = import.meta.env.VITE_backend_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: BaseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
export default axiosInstance;