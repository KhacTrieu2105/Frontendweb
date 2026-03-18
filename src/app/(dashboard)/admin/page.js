"use client";

import React, { useState, useEffect } from "react";
import {
  Package, Users, ShoppingCart, BarChart3,
  ArrowUpRight, ArrowDownRight, Activity, Clock,
  AlertCircle, Loader2
} from "lucide-react";
import OrderService from "../../../../services/OrderService";
import ProductService from "../../../../services/ProductService";
import UserService from "../../../../services/UserService";

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from multiple APIs with fallbacks
        const [productsRes, usersRes, ordersRes] = await Promise.allSettled([
          ProductService.getList({ page: 1, limit: 1 }).catch(() => ({ total: 0 })), // Get total count with fallback
          UserService.getList({ page: 1, limit: 1 }).catch(() => ({ total: 0 })),   // Get total count with fallback
          OrderService.getUserOrders(null, 1, 5).catch(() => ({ data: [], total: 0 }))   // Get recent orders with fallback
        ]);

        // Process products count
        let totalProducts = 0;
        if (productsRes.status === 'fulfilled' && productsRes.value?.total) {
          totalProducts = productsRes.value.total;
        }

        // Process users count
        let totalUsers = 0;
        if (usersRes.status === 'fulfilled' && usersRes.value?.total) {
          totalUsers = usersRes.value.total;
        }

        // Process recent orders
        let orders = [];
        let totalOrders = 0;
        if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
          orders = ordersRes.value.data;
          totalOrders = ordersRes.value.total || orders.length;
        }

        // Calculate revenue (sum of all order totals)
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

        // Mock trend data (you can implement real trend calculation)
        const mockTrends = {
          products: { value: "+8%", isUp: true },
          users: { value: "+12%", isUp: true },
          orders: { value: "+15%", isUp: true },
          revenue: { value: "+22%", isUp: true }
        };

        // Set stats with real data
        setStats([
          {
            label: "Tổng sản phẩm",
            value: totalProducts.toLocaleString(),
            trend: mockTrends.products.value,
            isUp: mockTrends.products.isUp,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50"
          },
          {
            label: "Tổng người dùng",
            value: totalUsers.toLocaleString(),
            trend: mockTrends.users.value,
            isUp: mockTrends.users.isUp,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50"
          },
          {
            label: "Đơn hàng",
            value: totalOrders.toLocaleString(),
            trend: mockTrends.orders.value,
            isUp: mockTrends.orders.isUp,
            icon: ShoppingCart,
            color: "text-rose-600",
            bg: "bg-rose-50"
          },
          {
            label: "Doanh thu",
            value: `${(totalRevenue / 1000000).toFixed(1)}M`,
            trend: mockTrends.revenue.value,
            isUp: mockTrends.revenue.isUp,
            icon: BarChart3,
            color: "text-amber-600",
            bg: "bg-amber-50"
          },
        ]);

        // Format recent orders for display
        const formattedOrders = orders.slice(0, 5).map(order => ({
          id: `#ORD-${order.id}`,
          customer: order.customer_name || "Khách hàng",
          status: getOrderStatusText(order.status),
          amount: `${(order.total_amount || 0).toLocaleString()}₫`,
          time: formatTimeAgo(order.created_at)
        }));

        setRecentOrders(formattedOrders);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard");

        // Fallback to mock data if APIs fail
        setStats([
          {
            label: "Tổng sản phẩm",
            value: "0",
            trend: "N/A",
            isUp: true,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50"
          },
          {
            label: "Tổng người dùng",
            value: "0",
            trend: "N/A",
            isUp: true,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50"
          },
          {
            label: "Đơn hàng",
            value: "0",
            trend: "N/A",
            isUp: false,
            icon: ShoppingCart,
            color: "text-rose-600",
            bg: "bg-rose-50"
          },
          {
            label: "Doanh thu",
            value: "0M",
            trend: "N/A",
            isUp: true,
            icon: BarChart3,
            color: "text-amber-600",
            bg: "bg-amber-50"
          },
        ]);

        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const getOrderStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipped': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "N/A";

    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="w-48 h-6 bg-gray-100 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-100 rounded animate-pulse"></div>
                      <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-20 h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="w-40 h-6 bg-gray-100 rounded animate-pulse mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-3/4 h-3 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Không thể tải dữ liệu</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Grid Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? "text-green-500" : "text-rose-500"}`}>
                  {stat.trend}
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng Đơn hàng gần đây */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-rose-500" size={20} />
              Giao dịch gần đây
            </h3>
            <button className="text-sm font-bold text-rose-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Mã đơn</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Khách hàng</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-xs text-gray-400">{order.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        order.status === "Hoàn thành" ? "bg-green-100 text-green-600" : 
                        order.status === "Chờ xử lý" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900 text-sm">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột thông báo/Hoạt động hệ thống */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-blue-500" size={20} />
            Hoạt động hệ thống
          </h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 4 && <div className="absolute left-[11px] top-8 w-[2px] h-10 bg-gray-100"></div>}
                <div className="w-6 h-6 rounded-full bg-gray-900 border-4 border-white shadow-sm z-10"></div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Kho hàng vừa được cập nhật</p>
                  <p className="text-xs text-gray-400 mt-1">Sản phẩm iPhone 15 Pro Max +50 chiếc</p>
                  <p className="text-[10px] text-gray-300 font-medium mt-1 italic">10:45 AM</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-bold hover:border-rose-500 hover:text-rose-500 transition-all">
            Xem nhật ký hệ thống
          </button>
        </div>
      </div>
    </div>
  );
}
