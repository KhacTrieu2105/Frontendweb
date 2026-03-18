"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ShoppingBag,
  Truck
} from "lucide-react";
import OrderService from "../../../../../services/OrderService";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        // API lấy đơn hàng của user hiện tại
        const res = await OrderService.getUserOrders(user.id, 1, 10);
        if (res.status === true) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Hàm render Badge trạng thái cho người dùng
  const renderStatus = (status) => {
    const config = {
      1: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-600 border-amber-200", icon: <Clock size={14} /> },
      2: { label: "Đã hoàn thành", color: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: <CheckCircle2 size={14} /> },
      0: { label: "Đã hủy", color: "bg-rose-50 text-rose-600 border-rose-200", icon: <XCircle size={14} /> },
    };
    const s = config[status] || config[1];
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.color}`}>
        {s.icon} {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <ShoppingBag size={32} />
          Lịch sử đơn hàng
        </h1>
        <p className="text-gray-500 mt-2">Theo dõi tình trạng các đơn hàng bạn đã đặt</p>
      </div>

      {/* Tabs Filter (Giả lập) */}
      <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        {["Tất cả", "Chờ xử lý", "Đang giao", "Đã giao", "Đã hủy"].map((tab) => (
          <button
            key={tab}
            className={`text-sm pb-3 px-2 transition-all whitespace-nowrap ${
              tab === "Tất cả" ? "border-b-2 border-black font-bold text-black" : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Top info */}
              <div className="flex flex-wrap justify-between items-start border-b border-gray-50 pb-4 mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Đơn hàng #{order.id}</p>
                    <p className="text-xs text-gray-500 italic">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                {renderStatus(order.status)}
              </div>

              {/* Items Preview (Ví dụ hiển thị tóm tắt) */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-3 overflow-hidden">
                   {/* Giả lập icon các sản phẩm */}
                   {[1, 2].map((i) => (
                     <div key={i} className="inline-block h-12 w-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center">
                        <ShoppingBag size={16} className="text-gray-400" />
                     </div>
                   ))}
                   {order.items_count > 2 && (
                     <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white bg-gray-50 text-[10px] font-bold text-gray-500">
                       +{order.items_count - 2}
                     </div>
                   )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Tổng thanh toán</p>
                  <p className="text-xl font-black text-rose-600">{order.total_amount?.toLocaleString()}₫</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                   <Truck size={14} />
                   <span>Giao hàng tiêu chuẩn</span>
                </div>
                <Link 
                  href={`/user/orders/${order.id}`}
                  className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
                >
                  Xem chi tiết <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 text-sm mt-1">Hãy mua sắm và quay lại đây nhé!</p>
            <Link href="/" className="inline-block mt-6 px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition">
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}