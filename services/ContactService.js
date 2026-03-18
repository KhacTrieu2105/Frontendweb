import httpAxios from "./httpaxios";

const ContactService = {
  // Phía Admin: Lấy danh sách
  getList: (params) => httpAxios.get("/contact", { params }),

  // Phía Người dùng: Gửi liên hệ mới
  create: (data) => httpAxios.post("/contact", data),

  // Phía Admin: Xóa
  delete: (id) => httpAxios.delete(`/contact/${id}`),

  // Phía Admin: Chi tiết
  getById: (id) => httpAxios.get(`/contact/${id}`),

  // Phía Admin: Phản hồi liên hệ
  reply: (id, data) => httpAxios.post(`/contact/reply/${id}`, data),

  // Test email functionality
  testEmail: (email) => httpAxios.post(`/contact/test-email`, { email }),
};

export default ContactService;
