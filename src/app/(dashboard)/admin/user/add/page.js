'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  Save,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Shield
} from "lucide-react";
import UserService from "../../../../../../services/UserService";

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    roles: "customer",
    status: "1",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await UserService.create(form);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/user");
      }, 1500);
    } catch (err) {
      setError("Thêm thành viên thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error("Create user error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans flex items-center justify-center">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Thành công!</h2>
          <p className="text-gray-600 mb-6">Thành viên đã được thêm vào hệ thống.</p>
          <div className="w-full bg-green-100 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/user"
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
                THÊM <span className="text-rose-500">THÀNH VIÊN</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Tạo tài khoản mới cho thành viên hệ thống.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Thông tin cơ bản</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                    Họ và tên *
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                      placeholder="Nhập họ và tên đầy đủ"
                      required
                    />
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                    Email *
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                      placeholder="example@email.com"
                      required
                    />
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                    Số điện thoại
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                      placeholder="0123 456 789"
                    />
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                    Địa chỉ
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({...form, address: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                      placeholder="Nhập địa chỉ đầy đủ"
                    />
                    <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN - Settings */}
          <div className="space-y-6">
            {/* Role & Status */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <Shield size={20} className="text-amber-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Quyền hạn & Trạng thái</h2>
              </div>

              <div className="space-y-6">
                {/* Role */}
                <div className="space-y-3">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                    Chức vụ
                  </label>
                  <select
                    value={form.roles}
                    onChange={(e) => setForm({...form, roles: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700"
                  >
                    <option value="customer">👤 Khách hàng</option>
                    <option value="admin">👑 Quản trị viên</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                    Trạng thái
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700"
                  >
                    <option value="1">✅ Hoạt động</option>
                    <option value="0">❌ Tạm ngừng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#1E1E2D] text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Tạo thành viên
                    </>
                  )}
                </button>

                <Link
                  href="/admin/user"
                  className="w-full bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center hover:bg-gray-200 transition-all"
                >
                  Hủy bỏ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
