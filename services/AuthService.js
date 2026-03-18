import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/NguyenKhacTrieu_backend/public/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Gắn token vào header cho mọi request
api.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const AuthService = {
  async login(data) {
    const response = await api.post("/login", data);
    return response.data;
  },

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      try {
        return userStr ? JSON.parse(userStr) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Phát sự kiện để đồng bộ giao diện toàn trang
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/auth/login";
    }
  },
};

export default AuthService;