// services/api.js
import axios from "axios";

const api = axios.create({
  // Sử dụng biến môi trường từ Vercel, nếu không có thì dùng thẳng link Render làm dự phòng
  baseURL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
    : "https://backendweb-1-i696.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
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
