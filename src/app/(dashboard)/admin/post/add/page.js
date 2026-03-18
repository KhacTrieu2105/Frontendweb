"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  Upload,
  X
} from "lucide-react";

import PostService from "../../../../../../services/PostService";
import TopicService from "../../../../../../services/TopicService";

export default function AddPostPage() {
  const router = useRouter();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    topic_id: "",
    title: "",
    description: "",
    content: "",
  });

  /* ================= LOAD TOPICS ================= */
  useEffect(() => {
    TopicService.getList().then(res => {
      if (res.status === true) setTopics(res.data || []);
    });
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Clear any previous errors
      setError("");

      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setThumbnail(null);
    setPreview(null);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.topic_id || !form.title || !form.content) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("topic_id", form.topic_id);
      formData.append("title", form.title);
      formData.append("description", form.description || "");
      formData.append("content", form.content);

      if (thumbnail) {
        formData.append("image", thumbnail);
      }

      // Debug: Log FormData contents
      console.log("=== FORM DATA BEING SENT ===");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const res = await PostService.create(formData);

      console.log("=== API RESPONSE ===");
      console.log("Response:", res);

      if (res && res.status === true) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/post");
        }, 1500);
      } else {
        console.error("API returned error:", res);
        console.error("Error details:", res?.errors || res?.message);

        // Show specific error message if available
        const errorMsg = res?.message || res?.errors?.image?.[0] || res?.errors?.title?.[0] || "Thêm bài viết thất bại. Vui lòng thử lại.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Create post error:", err);
      setError("Thêm bài viết thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/admin/post"
            className="flex items-center gap-2 mb-2"
          >
            <ArrowLeft size={18} /> Quay lại
          </Link>

          <h1 className="text-3xl font-bold flex gap-3">
            <FileText /> Thêm bài viết
          </h1>
        </div>

        <button
          form="add-post"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow"
        >
          <Save size={18} />
          {loading ? "Đang lưu..." : "Lưu bài viết"}
        </button>
      </div>

      {/* SUCCESS STATE */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8 text-center">
          <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-2">Thành công!</h3>
          <p className="text-green-700">Bài viết đã được thêm thành công.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-center gap-3">
          <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* FORM */}
      <form
        id="add-post"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* LEFT COLUMN - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nội dung bài viết */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Nội dung bài viết</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700"
                  placeholder="Nhập tiêu đề bài viết..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 resize-none"
                  placeholder="Mô tả ngắn gọn về bài viết..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                  <Sparkles size={12} />
                  Mô tả sẽ hiển thị ở phần preview và SEO
                </p>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">
                  Nội dung *
                </label>
                <textarea
                  rows={12}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 resize-vertical"
                  placeholder="Nhập nội dung bài viết..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Settings & Media */}
        <div className="space-y-6">
          {/* Chủ đề */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                <FileText size={20} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Chủ đề & Phân loại</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">
                  Chủ đề *
                </label>
                <select
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700"
                  value={form.topic_id}
                  onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                  required
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hình ảnh đại diện */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                <ImageIcon size={20} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Hình ảnh đại diện</h3>
            </div>

            {preview ? (
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border-2 border-gray-100">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">Hình ảnh sẽ hiển thị ở trang tin tức</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <ImageIcon size={48} className="text-gray-400 mx-auto mb-4" />
                <div className="space-y-3">
                  <p className="text-gray-600 font-medium">Chưa có hình ảnh</p>
                  <label className="inline-block">
                    <span className="bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-900 transition-all cursor-pointer flex items-center gap-2 mx-auto">
                      <Upload size={18} />
                      Chọn hình ảnh
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-3">PNG, JPG, WebP tối đa 5MB</p>
              </div>
            )}
          </div>

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
                    Tạo bài viết
                  </>
                )}
              </button>

              <Link
                href="/admin/post"
                className="w-full bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center hover:bg-gray-200 transition-all"
              >
                Hủy bỏ
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
