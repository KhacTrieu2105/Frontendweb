'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import UserService from "../../../../../services/UserService";
import {
  Plus, Search, Pencil, Trash2, Mail, 
  ShieldCheck, User
} from 'lucide-react';

export default function CustomerManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getList();
      if (response.status) setUsers(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "all" || u.status == filterStatus;
      const matchRole = filterRole === "all" || u.roles === filterRole;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchTerm, filterStatus, filterRole]);

  const handleDelete = async () => {
    try {
      await UserService.delete(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    } catch (err) {
      alert("Xóa thất bại!");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans flex items-center justify-center"><div className="text-center font-medium text-gray-500">Đang tải dữ liệu khách hàng...</div></div>;

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-full mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
              QUẢN LÝ <span className="text-rose-500">THÀNH VIÊN</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Hiển thị danh sách khách hàng và quản trị viên.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl w-[300px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
              />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-3 bg-white border-none shadow-sm rounded-2xl font-medium outline-none focus:ring-2 focus:ring-rose-500/20 transition-all text-sm">
              <option value="all">Tất cả chức vụ</option>
              <option value="admin">Quản trị viên</option>
              <option value="customer">Khách hàng</option>
            </select>
            <Link href="/admin/user/add" className="bg-[#1E1E2D] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all font-medium shadow-lg">
              <Plus size={20} /> Thêm thành viên
            </Link>
          </div>
        </div>

        {/* STATS PREVIEW (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng thành viên</p>
              <p className="text-2xl font-black text-gray-900">{filteredUsers.length}</p>
            </div>
          </div>
          {/* Có thể thêm các box stats khác ở đây */}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Thành viên</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Chức vụ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {user.avatar ? (
                        <img
                          src={`http://localhost/NguyenKhacTrieu_backend/public/storage/${user.avatar}`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center font-bold text-sm ${user.roles === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}">
                                ${user.name?.charAt(0).toUpperCase()}
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center font-bold text-sm ${user.roles === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail size={12}/> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-center">
                  {/* Chuyển thành Badge hiển thị tĩnh */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide ${
                    user.roles === 'admin' 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.roles === 'admin' ? <ShieldCheck size={14}/> : <User size={14}/>}
                    {user.roles?.toUpperCase()}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${user.status == 1 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {user.status == 1 ? "Hoạt động" : "Bị khóa"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/user/${user.id}/edit`} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all">
                      <Pencil size={18} />
                    </Link>
                    <button 
                      onClick={() => { setDeletingUser(user); setShowDeleteModal(true); }} 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-gray-400">Không tìm thấy thành viên nào phù hợp.</div>
        )}
        </div>
      </div>

      {/* Modal xóa giữ nguyên */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4"><Trash2 size={24} /></div>
            <h3 className="text-xl font-bold mb-2">Xác nhận xóa?</h3>
            <p className="mb-6 text-gray-500 text-sm">Thành viên <span className="font-bold text-gray-900">"{deletingUser.name}"</span> sẽ bị xóa vĩnh viễn.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2.5 border rounded-xl hover:bg-gray-50 font-semibold text-gray-600">Hủy</button>
              <button onClick={handleDelete} className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
