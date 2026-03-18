'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Save,
  AlertCircle,
  CheckCircle,
  Tag,
  Sparkles
} from "lucide-react";
import AttributeService from "../../../../../../services/AttributeService";

export default function AddAttribute() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vui lòng nhập tên thuộc tính");
      return;
    }

    setLoading(true);

    try {
      const res = await AttributeService.create({
        name: name.trim(),
        status: 1
      });

      if (res.status === true) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/attribute");
        }, 1500);
      } else {
        setError("Thêm thuộc tính thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi thêm thuộc tính:", error);
      setError("Không thể thêm thuộc tính. Vui lòng kiểm tra lại!");
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
          <p className="text-gray-600 mb-6">Thuộc tính đã được thêm vào hệ thống.</p>
          <div className="w-full bg-green-100 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/attribute"
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
                THÊM <span className="text-rose-500">THUỘC TÍNH</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Tạo thuộc tính mới cho sản phẩm.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Tag size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Thông tin thuộc tính</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
                Tên thuộc tính *
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                  placeholder="Ví dụ: Màu sắc, Kích thước, Chất liệu..."
                  required
                />
                <Tag size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Sparkles size={12} />
                Thuộc tính sẽ được sử dụng để phân loại sản phẩm
              </p>
            </div>

            {/* Examples */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-4">
                Ví dụ thuộc tính phổ biến:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Màu sắc", "Kích thước", "Chất liệu", "Thương hiệu", "Xuất xứ", "Kiểu dáng"].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setName(example)}
                    className="text-left px-3 py-2 bg-white rounded-xl text-sm font-medium text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all border border-gray-200 hover:border-rose-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1E1E2D] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Tạo thuộc tính
                  </>
                )}
              </button>

              <Link
                href="/admin/attribute"
                className="flex-1 bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center hover:bg-gray-200 transition-all"
              >
                Hủy bỏ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
