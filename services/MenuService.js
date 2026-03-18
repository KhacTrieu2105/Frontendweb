// services/MenuService.js
import api from "./httpaxios";

const MenuService = {
  // Public
  getList: () => api.get("/menu"),
  
  // Admin Management (Phải có prefix /admin)
  getById: (id) => api.get(`/admin/menu/${id}`),
  create: (data) => api.post("/admin/menu", data),
  update: (id, data) => api.put(`/admin/menu/${id}`, data),
  delete: (id) => api.delete(`/admin/admin/menu/${id}`) // Kiểm tra lại cấp độ admin trong api.php của bạn
};

export default MenuService;