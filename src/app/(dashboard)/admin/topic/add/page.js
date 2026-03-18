"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FolderPlus,
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
  Sparkles,
} from "lucide-react";

import TopicService from "../../../../../../services/TopicService";

export default function AddTopicPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name) {
      setError("Vui lòng nhập tên chủ đề");
      return;
    }

    try {
      setLoading(true);

      const res = await TopicService.create(form);

      if (res && res.status === true) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/topic");
        }, 1500);
      } else {
        setError("Thêm chủ đề thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Create topic error:", err);
      setError("Thêm chủ đề thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/topic"
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
                THÊM <span className="text-rose-500">CHỦ ĐỀ</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Tạo chủ đề mới cho bài viết.
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Thành công!</h3>
            <p className="text-green-700">Chủ đề đã được thêm thành công.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form
          id="add-topic"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin chủ đề */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Thông tin chủ đề</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">
                    Tên chủ đề *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700"
                    placeholder="Nhập tên chủ đề..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">
                    Mô tả chủ đề
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 resize-vertical"
                    placeholder="Mô tả ngắn gọn về chủ đề..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <Sparkles size={12} />
                    Mô tả sẽ giúp phân loại và tìm kiếm chủ đề dễ dàng hơn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Settings & Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading || success}
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
                      Tạo chủ đề
                    </>
                  )}
                </button>

                <Link
                  href="/admin/topic"
                  className="w-full bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center hover:bg-gray-200 transition-all"
                >
                  Hủy bỏ
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
