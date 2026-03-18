"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import promotionService from "../../../../../services/promotionService";
import { Plus, Trash2, Search, Calendar } from "lucide-react";

export default function PromotionPage() {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Load danh sách khuyến mãi
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const res = await promotionService.getList();

        if (res.status === true) {
          const list = res.data?.data || res.data || [];
          setPromotions(list);
        }
      } catch (err) {
        console.error("Load promotions error:", err);
        alert("Không thể tải danh sách khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Lọc theo tìm kiếm
  const filteredPromotions = promotions.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xóa khuyến mãi
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) return;

    try {
      await promotionService.delete(id);
      setPromotions(promotions.filter((p) => p.id !== id));
      alert("Xóa khuyến mãi thành công!");
    } catch (err) {
      alert("Xóa thất bại! Có thể đang có lỗi hệ thống.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Khuyến mãi</h1>
            <p className="text-gray-600 mt-2">Quản lý các chương trình giảm giá</p>
          </div>

          <Link
            href="/admin/promotion/add"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 shadow-lg transition font-medium"
          >
            <Plus size={22} />
            Thêm khuyến mãi mới
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-5 mb-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm tên khuyến mãi hoặc sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Bảng khuyến mãi */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="w-7 h-7 text-orange-500" />
              Danh sách khuyến mãi hiện tại
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Đang tải khuyến mãi...</div>
          ) : filteredPromotions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
              <p className="text-xl text-gray-600 font-medium">Chưa có khuyến mãi nào</p>
              <p className="text-gray-500 mt-2">
                {searchTerm ? "Không tìm thấy kết quả phù hợp" : "Hãy tạo khuyến mãi đầu tiên!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">Giá gốc</th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">Giá khuyến mãi</th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">Giảm</th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">Thời gian</th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredPromotions.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50 transition">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
<img
  src={item.image || "/placeholder.jpg"}
  alt={item.product_name}
  className="w-full h-full object-cover"
  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
/>



                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.product_name}</p>
                            <p className="text-sm text-gray-500">SKU: {item.product_slug || "N/A"}</p>
                          </div>
                        </div>
                      </td>

                      {/* GIÁ GỐC – DÙNG ĐÚNG FIELD TỪ BACKEND */}
                      <td className="px-8 py-6 text-center">
                        <span className="text-lg text-gray-600 line-through">
                          {Number(item.original_price).toLocaleString("vi-VN")}₫
                        </span>
                      </td>

                      {/* GIÁ KHUYẾN MÃI */}
                      <td className="px-8 py-6 text-center">
                        <span className="text-3xl font-bold text-red-600">
                          {Number(item.sale_price).toLocaleString("vi-VN")}₫
                        </span>
                      </td>

                      {/* % GIẢM – DÙNG ĐÚNG FIELD TỪ BACKEND */}
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-5 py-2 rounded-full text-lg font-bold">
                          -{item.discount_percent || 0}%
                        </span>
                      </td>

                      {/* THỜI GIAN */}
                      <td className="px-8 py-6 text-center text-sm">
                        <div className="text-gray-700">
                          <p>Từ: {new Date(item.date_begin).toLocaleDateString("vi-VN")}</p>
                          <p>Đến: {new Date(item.date_end).toLocaleDateString("vi-VN")}</p>
                        </div>
                      </td>

                      {/* THAO TÁC */}
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"
                          title="Xóa khuyến mãi"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tổng giảm giá dự kiến */}
          {filteredPromotions.length > 0 && (
            <div className="p-8 bg-orange-50 border-t border-orange-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-800 font-medium text-lg">
                Đang có <strong className="text-2xl">{filteredPromotions.length}</strong> chương trình khuyến mãi
              </p>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">TỔNG GIẢM GIÁ DỰ KIẾN</p>
                <p className="text-4xl font-black text-red-600">
                  ~ {Number(
                    filteredPromotions.reduce((sum, p) => sum + (p.original_price - p.sale_price), 0)
                  ).toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}