"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrderService from "../../../../../services/OrderService";
import { 
  Search, 
  Eye, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Calendar
} from "lucide-react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getList(page, limit, search);
      if (res.status === true) {
        setOrders(res.data);
        setTotal(res.total);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  // Hàm helper để render Badge trạng thái
  const renderStatus = (status) => {
    const styles = {
      1: "bg-amber-100 text-amber-700 border-amber-200", // Đang xử lý
      2: "bg-emerald-100 text-emerald-700 border-emerald-200", // Hoàn thành
      0: "bg-rose-100 text-rose-700 border-rose-200", // Đã hủy (ví dụ)
    };
    const labels = { 1: "Đang xử lý", 2: "Hoàn thành", 0: "Đã hủy" };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles[1]}`}>
        {labels[status] || "N/A"}
      </span>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-full mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
              QUẢN LÝ <span className="text-rose-500">ĐƠN HÀNG</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Theo dõi và quản lý các giao dịch từ khách hàng.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên, email, SĐT..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl w-[300px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border-none shadow-sm rounded-2xl font-medium outline-none focus:ring-2 focus:ring-rose-500/20 transition-all text-sm">
              <Filter size={16} />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>

        {/* STATS PREVIEW (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng đơn hàng</p>
              <p className="text-2xl font-black text-gray-900">{total}</p>
            </div>
          </div>
          {/* Có thể thêm các box stats khác ở đây */}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-4 w-20">Mã ĐH</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Thông tin liên hệ</th>
                  <th className="p-4">Ngày đặt</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">Đang tải dữ liệu...</td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4 font-mono font-bold text-gray-400 text-xs">#{o.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{o.name}</div>
                        <div className="text-xs text-gray-500">{o.email || 'No email'}</div>
                      </td>
                      <td className="p-4 text-gray-600">{o.phone}</td>
                      <td className="p-4 text-gray-500">
                        <div className="flex items-center gap-1.5 italic">
                          <Calendar size={14} />
                          {new Date().toLocaleDateString('vi-VN')} {/* Thay bằng o.created_at nếu có */}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {renderStatus(o.status)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/orders/${o.id}/show`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                        >
                          <Eye size={14} />
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <ShoppingBag size={48} className="mb-2" />
                        <p className="text-lg">Không tìm thấy đơn hàng nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Improved Pagination */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Hiển thị <span className="font-bold">{orders.length}</span> trên <span className="font-bold">{total}</span> kết quả
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1">
                {[...Array(Math.ceil(total / limit) || 1)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      page === i + 1
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={page * limit >= total}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
