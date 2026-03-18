// services/ProductService.js

import httpAxios from "./httpaxios";

const ProductService = {
  // Lấy danh sách sản phẩm
  getList: (page = 1, limit = 10, search = "") => {
    return httpAxios.get("/products", {
      params: { page, limit, search, t: Date.now() }, // Thêm timestamp để tránh cache
    });
  },

  // Lấy chi tiết sản phẩm
  getById: (id) => httpAxios.get(`/products/${id}`),
  getDetail: (id) => httpAxios.get(`/products/${id}`),

  // ✅ TẠO SẢN PHẨM MỚI - QUAN TRỌNG NHẤT
  create: (data) => {
    return httpAxios.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Nếu có transformRequest cần thiết (tùy instance axios của bạn)
      // transformRequest: [(data) => data], // để không tự convert FormData
    });
  },

  update(id, formData) {
    // Phải là .post để Laravel nhận diện được file trong FormData
    return axios.post(`products/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res.data);
},


  // Xóa sản phẩm
  delete: (id) => httpAxios.delete(`/products/${id}`),

  // ============ QUẢN LÝ THUỘC TÍNH (nếu cần riêng) ============
  addAttribute: (productId, attributeData) => {
    return httpAxios.post(`/products/${productId}/attributes`, attributeData);
  },

  updateAttribute: (productId, attributeId, attributeData) => {
    return httpAxios.put(`/products/${productId}/attributes/${attributeId}`, attributeData);
  },

  deleteAttribute: (productId, attributeId) => {
    return httpAxios.delete(`/products/${productId}/attributes/${attributeId}`);
  },

  getAttributes: (productId) => {
    return httpAxios.get(`/products/${productId}/attributes`);
  },
};

export default ProductService;
