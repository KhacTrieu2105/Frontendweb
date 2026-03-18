// services/promotionService.js
import api from "./httpaxios";

const promotionService = {
  getList: async (page = 1, limit = 10, search = "") => {
    let query = `?page=${page}&limit=${limit}`;

    if (search) {
      query += `&search=${encodeURIComponent(search)}`;
    }

    return api.get(`/Promotion${query}`);
  },
    create: (data) => {
    return api.post("/Promotion", data);
  },

  delete: async (id) => {
    return api.delete(`/Promotion/${id}`);
  },
};

export default promotionService;
