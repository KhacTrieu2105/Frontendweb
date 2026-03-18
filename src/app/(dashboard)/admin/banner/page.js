"use client";

import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import BannerService from "../../../../../services/BannerService";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");

  // ============================
  // GỌI API LẤY DANH SÁCH
  // ============================
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await BannerService.getList();
        // API trả về { status: true, data: [...] }
        const list = res.data ?? [];
        setBanners(list);
      } catch (err) {
        console.error("Lỗi API banner:", err);
        setError("Không thể tải dữ liệu banner!");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // ============================
  // LỌC + SEARCH
  // ============================
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchPos = positionFilter === "all" || b.position === positionFilter;
      return matchSearch && matchPos;
    });
  }, [banners, search, positionFilter]);

  // ============================
  // DELETE API
  // ============================
  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa banner này?")) return;
    try {
      await BannerService.delete(id);
      setBanners(banners.filter((b) => b.id !== id));
      alert("Xóa banner thành công!");
    } catch (err) {
      alert("Không thể xóa banner!");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl font-medium animate-pulse">Đang tải banner...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-600 text-xl font-bold">Lỗi: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">Quản lý Banner</h2>
            <p className="text-gray-600 mt-2">Hiển thị và quản lý tất cả banner hệ thống</p>
          </div>
          <Link
            href="/admin/banner/add"
            className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition font-medium shadow-md"
          >
            <Plus className="w-5 h-5" /> Thêm banner
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên banner..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white cursor-pointer"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="all">Tất cả vị trí</option>
              <option value="slideshow">Slideshow</option>
              <option value="ads">Quảng cáo</option>
            </select>
          </div>
        </div>

        {/* GRID CARD LIST */}
        {filteredBanners.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500">
            Không tìm thấy banner nào khớp với yêu cầu
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                {/* Ảnh banner */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {banner.image ? (
                    <img
                      src={`http://localhost/NguyenKhacTrieu_backend/public/storage/${banner.image.replace(/^.*[\\/]/, '')}`}
                      alt={banner.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x225?text=Lỗi+đường+dẫn+ảnh";
                      }}
                    />
                  ) : banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x225?text=Lỗi+đường+dẫn+ảnh";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                      Chưa có ảnh
                    </div>
                  )}

                  {/* Tag vị trí */}
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold backdrop-blur-sm">
                    {banner.position}
                  </span>
                </div>

                {/* Nội dung card */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg truncate" title={banner.name}>
                    {banner.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 italic">
                    Ngày tạo: {banner.created_at ? new Date(banner.created_at).toLocaleDateString("vi-VN") : "---"}
                  </p>

                  {/* Thao tác */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                    <Link
                      href={`/admin/banner/${banner.id}`}
                      className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" /> Xem
                    </Link>
                    <Link
                      href={`/admin/banner/${banner.id}/edit`}
                      className="text-gray-600 hover:text-yellow-600 transition flex items-center gap-1 text-sm font-medium"
                    >
                      <Pencil className="w-4 h-4" /> Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="text-gray-600 hover:text-red-600 transition flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
