// services/OrderService.js
import api from "./httpaxios";

const OrderService = {
  // Danh sách đơn hàng cho ADMIN
  async getList(page = 1, limit = 10, search = "", user_id = null) {
    try {
      return await api.get("/admin/orders", {
        params: {
          page,
          limit,
          search,
          user_id: user_id || undefined,
        },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      throw error;
    }
  },

  async getById(id) {
    return await api.get(`/admin/orders/${id}`);
  },

  async updateStatus(id, status) {
    return await api.put(`/admin/orders/${id}`, { status });
  },

  // Checkout cho user thường
  async checkout(orderData) {
    return await api.post("/orders", orderData);
  },

  // Lấy đơn hàng của user hiện tại (không phải admin)
  async getUserOrders(user_id, page = 1, limit = 10) {
    try {
      return await api.get("/orders", {
        params: {
          user_id,
          page,
          limit,
        },
      });
    } catch (error) {
      console.error("Lỗi lấy đơn hàng người dùng:", error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng của user
  async getUserOrderById(id) {
    return await api.get(`/orders/${id}`);
  },

  // Hủy đơn hàng (cho user)
  async cancelOrder(id) {
    return await api.put(`/orders/${id}/cancel`);
  },
};

export default OrderService;
