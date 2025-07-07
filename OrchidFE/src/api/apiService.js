import axios from 'axios';
import toast from 'react-hot-toast';

// Tạo một instance của axios
const apiService = axios.create({
    baseURL: 'http://localhost:8081', // Địa chỉ gốc của backend
});

// Thêm một interceptor để tự động đính kèm token vào mỗi request
apiService.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi chung
apiService.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error("Authentication error. Please log in again.");
            // Có thể thêm logic để tự động logout và chuyển hướng về trang login
            localStorage.removeItem('token');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
)

export default apiService;