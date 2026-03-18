import api from "./httpaxios";

const CategoryService = {
  getList: (params = {}) => {
    return api.get("/category", { params });
  },

  getById: (id) => {
    return api.get(`/category/${id}`);
  },

  create: (data) => {
    return api.post("/category", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

update(id, data) {
    return api.put(`/category/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  delete: (id) => {
    return api.delete(`/category/${id}`);
  },
};

export default CategoryService;
