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
  Folder,
} from "lucide-react";
import TopicService from "../../../../../services/TopicService";

export default function TopicList() {
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    const res = await TopicService.getList({ page, limit, search });
    if (res?.status === true) {
      setTopics(res.data);
      setTotal(res.total);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search]);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa chủ đề này?")) return;
    await TopicService.delete(id);
    fetchData();
  };

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-full mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
              QUẢN LÝ <span className="text-rose-500">CHỦ ĐỀ</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Quản lý danh sách chủ đề bài viết và phân loại nội dung.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input
                placeholder="Tìm theo tên chủ đề..."
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
              href="/admin/topic/add"
              className="bg-[#1E1E2D] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all font-medium shadow-lg"
            >
              <Plus size={20} /> Thêm chủ đề
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Folder size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng chủ đề</p>
              <p className="text-2xl font-black text-gray-900">{topics.length}</p>
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
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên chủ đề</th>
                  <th className="py-4 px-4 w-40 text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="py-4 px-4 w-40 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="py-4 px-4 w-40 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="py-4 px-4 text-right w-56 text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {topics.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-gray-500"
                    >
                      Không có chủ đề nào
                    </td>
                  </tr>
                )}

                {topics.map((topic) => (
                  <tr
                    key={topic.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-500">
                      #{topic.id}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900 line-clamp-2">
                        {topic.name}
                      </div>
                      {topic.description && (
                        <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {topic.description}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      {topic.slug}
                    </td>

                    <td className="py-4 px-4">
                      {topic.status == 1 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                          <BadgeCheck size={16} /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm">
                          <BadgeX size={16} /> Ẩn
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      {topic.created_at ? new Date(topic.created_at).toLocaleDateString("vi-VN") : "N/A"}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/admin/topic/${topic.id}/show`}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye size={16} /> Xem
                        </Link>

                        <Link
                          href={`/admin/topic/${topic.id}/edit`}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        >
                          <Pencil size={16} /> Sửa
                        </Link>

                        <button
                          onClick={() => handleDelete(topic.id)}
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
