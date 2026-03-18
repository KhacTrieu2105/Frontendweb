import httpAxios from "./httpaxios";

const AttributeService = {
  getList: () => httpAxios.get("/attributes"),
  
  // Lấy chi tiết 1 thuộc tính để sửa
  getById: (id) => httpAxios.get(`/attributes/${id}`),

  create: (data) => httpAxios.post("/attributes", data),

  // Cập nhật thuộc tính
  update: (id, data) => httpAxios.put(`/attributes/${id}`, data),

  delete: (id) => httpAxios.delete(`/attributes/${id}`),
};

export default AttributeService;