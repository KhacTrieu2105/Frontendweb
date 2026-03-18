"use client";

import Link from "next/link";
import CategoryService from "../../../../../../services/CategoryService";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Load danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await CategoryService.getList();

        if (res.status === true) {
          const list = res.data?.data || res.data || [];
          setCategories(list);
        } else {
          setError(res.message || "Lỗi tải danh mục");
        }
      } catch (err) {
        console.error("API error:", err);
        setError("Không kết nối được server!");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Lọc theo tìm kiếm
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await CategoryService.delete(deletingCategory.id);
      setCategories(categories.filter((c) => c.id !== deletingCategory.id));
      setShowDeleteModal(false);
      setDeletingCategory(null);
      alert("Xóa danh mục thành công!");
    } catch (err) {
      alert("Xóa thất bại! Có thể danh mục đang có sản phẩm.");
    }
  };

  /* Loading UI */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-medium animate-pulse">Đang tải danh mục...</div>
      </div>
    );
  }

  /* Error UI */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Lỗi: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">Danh mục</h2>
            <p className="text-gray-600 mt-2">Quản lý danh mục sản phẩm</p>
          </div>

          <Link
            href="/admin/caterogy/add"
            className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" /> Thêm danh mục
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên danh mục hoặc slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black transition outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 italic">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  // ✅ ĐÚNG ĐƯỜNG DẪN ẢNH – theo ảnh bạn gửi (public/image/)
                  const imageUrl = category.image
                    ? `/image/${category.image}`
                    : null;

                  return (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">#{category.id}</td>

                      {/* CỘT HÌNH ẢNH – ĐẸP GIỐNG TRANG SẢN PHẨM */}
                      <td className="px-6 py-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {category.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{category.slug}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            category.status == 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.status == 1 ? "Hoạt động" : "Ẩn"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {category.created_at
                          ? new Date(category.created_at).toLocaleDateString("vi-VN")
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/caterogy/${category.id}/edit`}
                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && deletingCategory && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Xác nhận xóa?</h3>
              <p className="mb-6 text-gray-500 text-sm leading-relaxed">
                Danh mục <span className="font-bold text-gray-900">"{deletingCategory.name}"</span> sẽ bị xóa vĩnh viễn.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-gray-600 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition shadow-md"
                >
                  Xóa ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}