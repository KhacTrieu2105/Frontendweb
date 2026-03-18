"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import BannerService from "../../../../../../../services/BannerService";

export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();

  // Khởi tạo state với cấu trúc mặc định để tránh lỗi undefined khi render
  const [form, setForm] = useState({
    name: "",
    image: "",
    link: "",
    position: "slideshow",
    status: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  // Đường dẫn cơ sở cho ảnh - Đảm bảo port và path đúng với Laravel của bạn
  const IMAGE_BASE_URL = "http://localhost/NguyenKhacTrieu_backend/public/storage/";

  // ============================
  // 1. LẤY DỮ LIỆU BANNER CHI TIẾT
  // ============================
  const fetchBanner = async () => {
  try {
    setFetching(true);
    const res = await BannerService.getById(id);
    
    // Kiểm tra kỹ cấu trúc res.data.data trước khi set
    if (res.data && res.data.status && res.data.data) {
      setForm({
        name: res.data.data.name || "",
        image: res.data.data.image || "",
        link: res.data.data.link || "",
        position: res.data.data.position || "slideshow",
        status: res.data.data.status ?? 1
      });
    } else {
      setError("Không tìm thấy dữ liệu banner này.");
    }
  } catch (err) {
    console.error("Lỗi fetch banner:", err);
    setError("Không thể tải dữ liệu banner. Vui lòng kiểm tra lại ID.");
  } finally {
    setFetching(false);
  }
};

  // ============================
  // 2. XỬ LÝ CẬP NHẬT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chỉ gửi các field cần thiết cho backend
      const payload = {
        name: form.name,
        image: form.image,
        link: form.link,
        position: form.position,
        status: form.status
      };

      const res = await BannerService.update(id, payload);
      
      if (res.data.status) {
        alert("Cập nhật banner thành công!");
        router.push("/admin/banner");
      }
    } catch (err) {
      console.error("Lỗi update banner:", err);
      const msg = err.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Trạng thái đang tải dữ liệu ban đầu
  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
      <Loader2 className="animate-spin mb-4 w-10 h-10 text-black" />
      <p className="animate-pulse">Đang tải dữ liệu banner #{id}...</p>
    </div>
  );

  // Trạng thái lỗi không tìm thấy ID
  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-red-50 rounded-2xl border border-red-100 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-red-800">{error}</h2>
      <Link href="/admin/banner" className="text-red-600 underline mt-4 inline-block">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Nút quay lại */}
      <Link href="/admin/banner" className="flex items-center gap-2 text-gray-500 hover:text-black transition-all w-fit">
        <ArrowLeft size={20} /> Quay lại quản lý
      </Link>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-black rounded-xl">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Chỉnh sửa Banner
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tên Banner */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">Tên banner</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-black focus:outline-none transition-all bg-gray-50 focus:bg-white"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Banner khuyến mãi Tết"
              required
            />
          </div>

          {/* Đường dẫn ảnh */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">File ảnh (Path)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-black focus:outline-none transition-all bg-gray-50 focus:bg-white"
              value={form.image || ""}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="VD: banners/hinh-anh.jpg"
              required
            />
          </div>

          {/* Vị trí */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">Vị trí hiển thị</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-black focus:outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            >
              <option value="slideshow">Slideshow (Trang chủ)</option>
              <option value="ads">Ads (Quảng cáo bên hông)</option>
            </select>
          </div>

          {/* Link liên kết */}
          <div className="md:col-span-1">
            <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">Link liên kết</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-black focus:outline-none transition-all bg-gray-50 focus:bg-white"
              value={form.link || ""}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="VD: /san-pham/dien-thoai"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">Trạng thái</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-black focus:outline-none transition-all bg-gray-50 focus:bg-white"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: parseInt(e.target.value) })}
            >
              <option value={1}>Đang hoạt động (Hiện)</option>
              <option value={0}>Tạm dừng (Ẩn)</option>
            </select>
          </div>
        </div>

        {/* Khu vực xem trước ảnh */}
        <div className="pt-4">
          <label className="block mb-3 text-sm font-bold text-gray-700 uppercase">Xem trước hiển thị</label>
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 min-h-[250px] flex items-center justify-center">
            {form.image ? (
              <img
                src={`${IMAGE_BASE_URL}${form.image}`}
                alt="Preview"
                className="max-w-full max-h-[400px] object-contain"
                onError={(e) => {
                  e.target.src = "https://placehold.co/800x400?text=Khong+Tim+Thay+Anh+Tai+Storage";
                }}
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center gap-2">
                <ImageIcon size={40} strokeWidth={1} />
                <p>Chưa có hình ảnh</p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2 italic">* Lưu ý: Đảm bảo bạn đã chạy php artisan storage:link để hiển thị được ảnh thực tế.</p>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
          <Link
            href="/admin/banner"
            className="px-8 py-4 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-10 py-4 rounded-xl flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 font-bold shadow-xl shadow-gray-200 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? "Đang xử lý..." : "Cập nhật Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}