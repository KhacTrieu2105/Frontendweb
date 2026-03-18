"use client";

import { useEffect, useState } from "react";
import StockinService from "../../../../../services/StockinService";
import Link from "next/link";
import { Plus, Search, Calendar, Hash, FileText, Package } from "lucide-react";

export default function StockInPage() {
  const [stockins, setStockins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [pages, setPages] = useState([]);

  // ================== FETCH DATA ==================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await StockinService.getList({
          page,
          limit,
          search,
        });

        if (res?.status) {
          setStockins(res.data);
          const totalPages = Math.ceil(res.total / limit);
          setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhập kho:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, limit]);

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-full mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
              QUẢN LÝ <span className="text-rose-500">NHẬP KHO</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Theo dõi và quản lý các lô hàng nhập về hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm mã phiếu hoặc ghi chú..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl w-[300px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
              />
            </div>
            <Link
              href="/admin/stock-in/add"
              className="bg-[#1E1E2D] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all font-medium shadow-lg"
            >
              <Plus size={20} /> Tạo phiếu nhập
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng phiếu nhập</p>
              <p className="text-2xl font-black text-gray-900">{stockins.length}</p>
            </div>
          </div>
          {/* Có thể thêm các box stats khác ở đây */}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 text-center">ID</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider"><div className="flex items-center gap-2"><Hash size={14}/> Mã phiếu</div></th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center"><div className="flex justify-center items-center gap-2"><Package size={14}/> Số lượng</div></th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider"><div className="flex items-center gap-2"><Calendar size={14}/> Ngày tạo</div></th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider"><div className="flex items-center gap-2"><FileText size={14}/> Ghi chú</div></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400 animate-pulse font-medium">Đang tải dữ liệu...</td>
              </tr>
            ) : stockins.length > 0 ? (
              stockins.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 text-sm text-gray-400 text-center">#{item.id}</td>
                  <td className="p-4">
                    <span className="font-bold text-blue-600 cursor-pointer hover:underline">
                      {item.code}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {item.total_qty ?? 0}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    {Number(item.total_amount).toLocaleString("vi-VN")} <span className="text-[10px] underline">đ</span>
                  </td>
                  <td className="p-4 text-center">
                    {item.status === 1 ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-green-100 text-green-700">Hoạt động</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-red-100 text-red-700">Đã hủy</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString("vi-VN", {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4 text-sm text-gray-400 italic max-w-[200px] truncate">
                    {item.note || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-500 italic">Không tìm thấy phiếu nhập nào</td>
              </tr>
            )}
          </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pages.length > 1 && (
            <div className="flex justify-center items-center gap-2 py-6 border-t bg-gray-50/30">
              <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition shadow-sm"
              >
                  Trước
              </button>
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[40px] h-10 rounded-lg border font-bold transition shadow-sm ${
                    p === page
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                  disabled={page === pages.length}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition shadow-sm"
              >
                  Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
