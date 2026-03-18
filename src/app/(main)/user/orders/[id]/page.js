"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, Truck, MapPin, Phone, CreditCard,
  AlertCircle, Loader2, ShoppingBag, Clock
} from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/NguyenKhacTrieu_backend/public/api",
});

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      router.push("/auth/login");
      return;
    }

    setUser(savedUser);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${orderId}`);
      if (res.data.status) {
        // Laravel trả về dữ liệu trong object 'data'
        setOrder(res.data.data);
      } else {
        setError("Không thể tải chi tiết đơn hàng");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.response?.status === 404 ? "Đơn hàng không tồn tại" : "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600';
      case 'paid': return 'bg-green-100 text-green-600';
      case 'shipping': return 'bg-yellow-100 text-yellow-600';
      case 'delivered': return 'bg-blue-100 text-blue-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // --- LOGIC KIỂM TRA TRẠNG THÁI RENDER ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600 font-medium">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Thông báo</h2>
          <p className="text-gray-600 mb-6">{error || "Đơn hàng không tồn tại."}</p>
          <button
            onClick={() => router.push('/user/profile')}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH (Chỉ chạy khi order đã có dữ liệu) ---
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-indigo-600 hover:gap-3 transition-all mb-6 font-bold"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột Trái: Sản phẩm & Trạng thái */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <ShoppingBag size={24} className="text-indigo-600" /> Sản phẩm
                </h2>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                {/* BACKEND TRẢ VỀ 'details' (theo logic eager loading with('details')) */}
                {order.details?.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-50">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={item.product?.thumbnail ? `http://localhost/NguyenKhacTrieu_backend/public/storage/${item.product.thumbnail}` : "https://via.placeholder.com/150"}
                        alt="product"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.product?.name || `Sản phẩm #${item.product_id}`}</h3>
                      <p className="text-sm text-gray-500 font-medium">Số lượng: {item.qty}</p>
                      <p className="text-indigo-600 font-black mt-1">
                        {Number(item.price).toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-3">
                  <span>Tổng cộng</span>
                  <span className="text-indigo-600">{Number(order.total_amount).toLocaleString()}₫</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Thông tin khách hàng */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black mb-6 text-gray-900 flex items-center gap-2">
                <MapPin size={20} className="text-indigo-600" /> Nhận hàng
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block">Người nhận</label>
                  <p className="font-bold text-gray-900">{order.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block">Số điện thoại</label>
                  <p className="font-bold text-gray-900">{order.phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block">Địa chỉ</label>
                  <p className="font-bold text-gray-900 text-sm leading-relaxed">{order.address}</p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-2 font-black text-indigo-600">
                    <CreditCard size={16} />
                    <span className="uppercase text-xs font-bold">{order.payment_method}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
