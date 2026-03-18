"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios"; // Đảm bảo bạn đã install axios
import {
  ArrowLeft,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  Upload,
  X,
  Edit
} from "lucide-react";

import PostService from "../../../../../../../services/PostService";
import TopicService from "../../../../../../../services/TopicService";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [initialImage, setInitialImage] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const postRes = await PostService.getById(id);
        if (postRes?.data) {
          const postData = postRes.data;
          setForm({
            topic_id: postData.topic_id || "",
            title: postData.title || "",
            description: postData.description || "",
            content: postData.content || "",
            status: postData.status || 1,
          });

          if (postData.image) {
            const fullImageUrl = `http://localhost/NguyenKhacTrieu_backend/public/storage/${postData.image}`;
            setInitialImage(fullImageUrl);
            setPreview(fullImageUrl);
          }
        }

        const topicRes = await TopicService.getList();
        if (topicRes?.status === true) {
          setTopics(topicRes.data || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Không thể tải dữ liệu bài viết");
      }
    };

    loadData();
  }, [id]);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP');
        return;
      }
      setError("");
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setThumbnail(null);
    setPreview(initialImage || null);
  };

  /* ================= SUBMIT (FIXED 405 ERROR) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.content || !form.topic_id) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setLoading(true);

      // 1. Sử dụng FormData
      const formData = new FormData();
      
      /** * QUAN TRỌNG: Laravel không nhận dữ liệu multipart/form-data qua PUT/PATCH một cách trực tiếp.
       * Ta gửi bằng POST và "giả lập" phương thức PUT bằng _method.
       */
      formData.append("_method", "PUT"); 
      
      formData.append("topic_id", form.topic_id);
      formData.append("title", form.title);
      formData.append("description", form.description || "");
      formData.append("content", form.content);
      formData.append("status", form.status);

      if (thumbnail) {
        formData.append("image", thumbnail);
      }

      // 2. Lấy token từ localStorage (nếu có)
      const token = localStorage.getItem("token");

      // 3. Gọi trực tiếp axios hoặc thông thông qua Service nhưng dùng phương thức POST
      // Lưu ý: PostService.update của bạn cần được sửa để hỗ trợ gửi POST với _method PUT
      const res = await axios.post(`http://localhost/NguyenKhacTrieu_backend/public/api/post/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.data.status === true) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/post");
        }, 1500);
      } else {
        setError(res.data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Update post error:", err);
      const serverError = err.response?.data?.message || "Lỗi kết nối server (405 hoặc 500)";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return (
      <div className="p-6 min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-pulse font-medium text-gray-500 text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/post"
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
                SỬA <span className="text-rose-500">BÀI VIẾT</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">Chỉnh sửa nội dung cho bài viết #{id}</p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in zoom-in">
            <CheckCircle size={32} className="text-green-600" />
            <div>
              <h3 className="font-bold text-green-800">Cập nhật thành công!</h3>
              <p className="text-green-700 text-sm">Hệ thống đang chuyển hướng về danh sách...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-shake">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Edit size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Thông tin bài viết</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all font-bold text-gray-800"
                    placeholder="Ví dụ: Xu hướng túi xách 2026..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Mô tả ngắn (SEO)</label>
                  <textarea
                    rows={3}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all text-gray-700 resize-none"
                    placeholder="Tóm tắt ngắn gọn nội dung..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Nội dung chi tiết *</label>
                  <textarea
                    rows={12}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/20 outline-none transition-all text-gray-700"
                    placeholder="Viết nội dung tại đây..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Meta & Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Phân loại</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Chủ đề bài viết</label>
                  <select
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-none focus:ring-2 focus:ring-rose-500/20"
                    value={form.topic_id}
                    onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                  >
                    <option value="">Chọn chủ đề</option>
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Trạng thái bài viết</label>
                  <select
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-none focus:ring-2 focus:ring-rose-500/20"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value={1}>Đang hiển thị</option>
                    <option value={2}>Bản nháp / Ẩn</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8 text-center">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Ảnh bìa</h3>
              </div>

              {preview ? (
                <div className="relative group rounded-3xl overflow-hidden border-2 border-gray-100 aspect-video">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="bg-white p-2 rounded-full text-red-500 hover:scale-110 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:bg-gray-50 transition cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs font-bold text-gray-400 uppercase">Tải ảnh lên</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E1E2D] hover:bg-rose-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}