"use client";

import Link from "next/link";
import { Plus, Edit, Trash2, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import AttributeService from "../../../../../services/AttributeService";

export default function AttributePage() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH =================
  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await AttributeService.getList();

      if (res?.data?.status === true) {
        setAttributes(res.data.data || []);
      } else if (Array.isArray(res?.data)) {
        setAttributes(res.data);
      } else {
        setAttributes([]);
      }
    } catch (err) {
      setError("Không kết nối được server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Xóa thuộc tính này?")) return;
    try {
      await AttributeService.delete(id);
      setAttributes((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Xóa thất bại!");
    }
  };

  // ================= FILTER =================
  const filteredAttributes = attributes.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= UI STATE =================
  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans flex items-center justify-center">
        <div className="text-center font-medium text-gray-500">Đang tải thuộc tính...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans flex items-center justify-center">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-full mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
              QUẢN LÝ <span className="text-rose-500">THUỘC TÍNH</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Quản lý danh sách thuộc tính sản phẩm (màu sắc, kích thước, chất liệu...).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl w-[300px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
              />
            </div>
            <Link
              href="/admin/attribute/add"
              className="bg-[#1E1E2D] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Thêm thuộc tính
            </Link>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <SlidersHorizontal size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng thuộc tính</p>
              <p className="text-2xl font-black text-gray-900">{filteredAttributes.length}</p>
            </div>
          </div>
          {/* Có thể thêm các box stats khác ở đây */}
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Tên thuộc tính
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredAttributes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-gray-500 italic"
                  >
                    Không có thuộc tính nào
                  </td>
                </tr>
              ) : (
                filteredAttributes.map((attr) => (
                  <tr
                    key={attr.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      #{attr.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {attr.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                      {attr.slug}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <Link
                          href={`/admin/attribute/edit/${attr.id}`}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(attr.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
