"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, Link as LinkIcon, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import MenuService from "../../../../../services/MenuService";

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =============================
  // 1. Load danh sách từ API
  // =============================
  const loadMenu = async () => {
    try {
      setLoading(true);
      const response = await MenuService.getList();
      
      // Kiểm tra cấu trúc response từ Interceptor
      if (response && response.status) {
        setMenus(response.data || []);
      } else {
        setError("Không thể tải danh sách menu.");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // =============================
  // 2. Xử lý Lọc dữ liệu (An toàn)
  // =============================
  const filteredMenus = useMemo(() => {
    if (!Array.isArray(menus)) return [];
    
    return menus.filter((item) => {
      // Sử dụng optional chaining (?.) để tránh lỗi undefined name
      const matchesSearch = item?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesPosition = positionFilter === "" || item?.position === positionFilter;
      return matchesSearch && matchesPosition;
    });
  }, [menus, search, positionFilter]);

  // =============================
  // 3. Xóa Menu
  // =============================
  const deleteMenu = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa menu này không?")) return;

    try {
      const res = await MenuService.delete(id);
      if (res.status) {
        setMenus(prev => prev.filter((m) => m.id !== id));
        alert("Xóa thành công!");
      }
    } catch (err) {
      alert("Lỗi: Không thể xóa menu. Vui lòng kiểm tra lại quyền admin.");
    }
  };

  // =============================
  // UI RENDER
  // =============================
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
      <Loader2 className="animate-spin mb-4 w-10 h-10 text-rose-500" />
      <p className="font-medium animate-pulse">Đang tải dữ liệu menu...</p>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-full mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
              QUẢN LÝ <span className="text-rose-500">MENU</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Hệ thống điều hướng đa nguồn (Category, Topic, Page)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm tên menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl w-[250px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
              />
            </div>

            {/* Position Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl font-medium outline-none focus:ring-2 focus:ring-rose-500/20 transition-all text-sm appearance-none"
              >
                <option value="">Tất cả vị trí</option>
                <option value="mainmenu">Main Menu</option>
                <option value="footermenu">Footer Menu</option>
              </select>
            </div>

            <Link
              href="/admin/menu/add"
              className="bg-[#1E1E2D] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all font-bold shadow-lg shadow-gray-200"
            >
              <Plus className="w-5 h-5" /> Thêm menu mới
            </Link>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3">
            <span className="font-bold">Lỗi:</span> {error}
            <button onClick={loadMenu} className="underline ml-auto">Thử lại</button>
          </div>
        )}

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          {filteredMenus.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <Search className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-500 font-medium">Không tìm thấy menu nào phù hợp với bộ lọc</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tên Menu</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Đường dẫn</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Loại nguồn</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Vị trí</th>
                    <th className="p-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filteredMenus.map((menu) => (
                    <tr key={menu.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="p-5">
                        <p className="font-bold text-gray-900 group-hover:text-rose-500 transition-colors">
                          {menu?.name || "Chưa đặt tên"}
                        </p>
                        <span className="text-[10px] text-gray-400 uppercase">ID: #{menu.id}</span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                          <LinkIcon size={14} />
                          {menu?.link}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter ${
                          menu?.type === 'category' ? 'bg-orange-50 text-orange-600' :
                          menu?.type === 'topic' ? 'bg-purple-50 text-purple-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {menu?.type || 'custom'}
                        </span>
                      </td>
                      <td className="p-5 font-medium text-gray-600 text-sm">
                        {menu?.position}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/menu/${menu.id}/edit`}
                            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition-all"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => deleteMenu(menu.id)}
                            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                            title="Xóa menu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TOTAL FOOTER */}
        <div className="flex justify-between items-center px-4">
          <p className="text-sm text-gray-500 font-medium">
            Hiển thị <span className="text-black font-bold">{filteredMenus.length}</span> trên tổng số <span className="text-black font-bold">{menus.length}</span> menu
          </p>
        </div>
      </div>
    </div>
  );
}