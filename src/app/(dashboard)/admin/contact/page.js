"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2, Reply, Search, Mail, Phone, Calendar, MoreHorizontal, Filter } from "lucide-react";
import Link from "next/link";
import ContactService from "../../../../../services/ContactService";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ContactService.getList({ search });
      if (res?.status === true) {
        setContacts(res.data);
      }
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa liên hệ này?")) return;
    try {
      await ContactService.delete(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
            QUẢN LÝ <span className="text-rose-500">LIÊN HỆ</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Theo dõi và phản hồi các yêu cầu từ khách hàng.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const email = prompt("Nhập email để test:");
              if (email) {
                ContactService.testEmail(email).then(() => {
                  alert("Email test đã được gửi!");
                }).catch(() => {
                  alert("Gửi email test thất bại!");
                });
              }
            }}
            className="px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all font-medium text-sm"
          >
            Test Email
          </button>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
            <input
              placeholder="Tìm tên, email, sđt..."
              className="pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl w-[300px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && fetchData()}
            />
          </div>
          <button onClick={fetchData} className="p-3 bg-white shadow-sm rounded-2xl hover:bg-gray-50 text-gray-600 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* STATS PREVIEW (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng liên hệ</p>
            <p className="text-2xl font-black text-gray-900">{contacts.length}</p>
          </div>
        </div>
        {/* Có thể thêm các box stats khác ở đây */}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Khách hàng</th>
                <th className="py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thông tin liên lạc</th>
                <th className="py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thời gian</th>
                <th className="py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
                <th className="py-6 px-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">Đang tải dữ liệu...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <Mail className="text-gray-200" size={48} />
                        <p className="text-gray-400 font-bold">Không tìm thấy liên hệ nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="group hover:bg-gray-50/50 transition-all">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-black text-xs">
                          {c.name ? c.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none">{c.name || "N/A"}</p>
                          <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">ID: #{c.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-6 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm font-medium">{c.email || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-sm font-medium">{c.phone || "-"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString("vi-VN") : "-"}
                        </span>
                      </div>
                    </td>

                    <td className="py-6 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                        Mới
                      </span>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/contact/${c.id}/show`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          href={`/admin/contact/${c.id}/reply`}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Trả lời"
                        >
                          <Reply size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="group-hover:hidden">
                         <MoreHorizontal className="ml-auto text-gray-300" size={20} />
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
