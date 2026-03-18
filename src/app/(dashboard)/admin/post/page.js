"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  BadgeCheck,
  BadgeX,
} from "lucide-react";
import PostService from "../../../../../services/PostService";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    const res = await PostService.getList({ page, limit, search });
    if (res?.status === true) {
      setPosts(res.data);
      setTotal(res.total);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search]);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    await PostService.delete(id);
    fetchData();
  };

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-full mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
              QUẢN LÝ <span className="text-rose-500">BÀI VIẾT</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Quản lý danh sách bài viết và nội dung website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input
                placeholder="Tìm theo tiêu đề bài viết..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl w-[300px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
              />
            </div>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-4 py-3 bg-white border-none shadow-sm rounded-2xl font-medium outline-none focus:ring-2 focus:ring-rose-500/20 transition-all text-sm"
            >
              <option value={5}>5 dòng</option>
              <option value={10}>10 dòng</option>
              <option value={20}>20 dòng</option>
            </select>
            <Link
              href="/admin/post/add"
              className="bg-[#1E1E2D] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all font-medium shadow-lg"
            >
              <Plus size={20} /> Thêm bài viết
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng bài viết</p>
              <p className="text-2xl font-black text-gray-900">{posts.length}</p>
            </div>
          </div>
          {/* Có thể thêm các box stats khác ở đây */}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-4 w-16 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-4 px-4 w-20 text-xs font-bold text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="py-4 px-4 w-40 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="py-4 px-4 w-40 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="py-4 px-4 text-right w-56 text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {posts.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-gray-500"
                    >
                      Không có bài viết nào
                    </td>
                  </tr>
                )}

                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-500">
                      #{post.id}
                    </td>

                    <td className="py-4 px-4">
                      {post.image ? (
                        <img
                          src={`http://localhost/NguyenKhacTrieu_backend/public/storage/${post.image}`}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-400">No img</span>
                        </div>
                      )}
                      {/* Fallback div in case image fails to load */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center hidden">
                        <span className="text-xs text-gray-400">Error</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </div>
                      {post.description && (
                        <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {post.description}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {post.status == 1 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                          <BadgeCheck size={16} /> Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm">
                          <BadgeX size={16} /> Ẩn
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "N/A"}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/admin/post/${post.id}/show`}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye size={16} /> Xem
                        </Link>

                        <Link
                          href={`/admin/post/${post.id}/edit`}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        >
                          <Pencil size={16} /> Sửa
                        </Link>

                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Trang {page} / {Math.ceil(total / limit) || 1}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              ◀
            </button>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
