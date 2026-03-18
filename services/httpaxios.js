// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/NguyenKhacTrieu_backend/public/api", // ← Chuẩn nhất khi chạy php artisan serve
  // Nếu bạn buộc phải dùng XAMPP/public folder: "http://localhost/NguyenKhacTrieu_backend/public/api"
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Tự động gắn Bearer Token nếu có (chỉ chạy ở client-side)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: trả về data trực tiếp + xử lý 401 (logout tự động)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - Token không hợp lệ hoặc hết hạn");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
