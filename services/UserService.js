import api from "./httpaxios";

const UserService = {
  getList: (params = {}) => api.get("/user", { params }),
  getById: (id) => api.get(`/user/${id}`),
  create: (data) => api.post("/user", data),
  update: (id, data) => api.put(`/user/${id}`, data),
  delete: (id) => api.delete(`/user/${id}`),
};

export default UserService;
