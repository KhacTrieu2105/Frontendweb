import api from "./httpaxios";

// services/BannerService.js
const BannerService = {
  // Giữ nguyên getList public nếu cần
  getList: (params = {}) => api.get("/banner", { params }),

  // Cập nhật các hàm quản lý phải có tiền tố /admin
  getById: (id) => api.get(`/admin/banner/${id}`), 
  create: (data) => api.post("/admin/banner", data),
  update: (id, data) => api.put(`/admin/banner/${id}`, data), // URL đúng: /api/admin/banner/{id}
  delete: (id) => api.delete(`/admin/banner/${id}`)
};

export default BannerService;
