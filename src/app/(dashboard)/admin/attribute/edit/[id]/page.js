'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Tag,
  Sparkles,
  Edit
} from "lucide-react";
import AttributeService from "../../../../../../../services/AttributeService";

export default function EditAttribute({ params }) {
  // Giải nén params bằng React.use()
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const res = await AttributeService.getById(id);

        // Kiểm tra dữ liệu an toàn trước khi truy cập 'name'
        if (res && res.data) {
          // API trả về: { status: true, data: { id, name, ... } }
          const attrName = res.data.name;

          if (attrName) {
            setName(attrName);
            setOriginalName(attrName);
          } else {
            console.error("Không tìm thấy trường name trong dữ liệu:", res.data);
            setError("Không thể tải thông tin thuộc tính");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thuộc tính:", error);
        setError("Không thể tải thông tin thuộc tính");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAttribute();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vui lòng nhập tên thuộc tính");
      return;
    }

    if (name.trim() === originalName) {
      setError("Tên thuộc tính chưa được thay đổi");
      return;
    }

    setUpdating(true);

    try {
      const res = await AttributeService.update(id, { name: name.trim() });
      if (res.status === true) {
        setSuccess(true);
        setOriginalName(name.trim());
        setTimeout(() => {
          router.push("/admin/attribute");
        }, 1500);
      } else {
        setError("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setError("Lỗi khi cập nhật thuộc tính!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans flex items-center justify-center">
        <div className="text-center font-medium text-gray-500">Đang tải thông tin thuộc tính...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans flex items-center justify-center">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Cập nhật thành công!</h2>
          <p className="text-gray-600 mb-6">Thuộc tính đã được cập nhật.</p>
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
            <button
              onClick={() => router.back()}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
                SỬA <span className="text-rose-500">THUỘC TÍNH</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Cập nhật thông tin thuộc tính #{id}.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Edit size={20} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Chỉnh sửa thuộc tính</h2>
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
                  placeholder="Nhập tên thuộc tính mới..."
                  required
                />
                <Tag size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Sparkles size={12} />
                Tên gốc: <span className="font-medium text-gray-700">{originalName}</span>
              </p>
            </div>

            {/* Current Info */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-sm font-black text-blue-700 uppercase tracking-widest mb-3">
                Thông tin hiện tại:
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600 font-medium">ID:</span>
                  <span className="text-sm font-bold text-blue-800">#{id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600 font-medium">Tên hiện tại:</span>
                  <span className="text-sm font-bold text-blue-800">{originalName}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={updating || name.trim() === originalName}
                className="flex-1 bg-[#1E1E2D] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Lưu thay đổi
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center hover:bg-gray-200 transition-all"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
