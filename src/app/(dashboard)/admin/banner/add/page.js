"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import Link from "next/link";
import BannerService from "../../../../../../services/BannerService";

export default function AddBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: "",
    link: "",
    position: "slideshow",
    status: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await BannerService.create(form);
      alert("Thêm banner thành công!");
      router.push("/admin/banner");
    } catch (err) {
      alert("Thêm banner thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/admin/banner"
        className="flex items-center gap-2 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </Link>

      {/* Title */}
      <div className="flex items-center gap-3">
        <ImageIcon className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold text-gray-900">Thêm banner</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-8 space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Tên banner
          </label>
          <input
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="VD: Banner khuyến mãi tháng 12"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Ảnh banner
          </label>
          <input
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="banner/banner1.jpg"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
          />

          {/* Preview */}
          {form.image && (
            <div className="mt-4 border rounded-xl overflow-hidden">
              <img
                src={`http://127.0.0.1:8000/storage/${form.image}`}
                alt="preview"
                className="w-full h-56 object-cover"
              />
            </div>
          )}
        </div>

        {/* Link */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Link khi click
          </label>
          <input
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="https://example.com"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        </div>

        {/* Position */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Vị trí hiển thị
          </label>
          <select
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            value={form.position}
            onChange={(e) =>
              setForm({ ...form, position: e.target.value })
            }
          >
            <option value="slideshow">Slideshow</option>
            <option value="ads">Quảng cáo</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Trạng thái
          </label>
          <select
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="1">Hiển thị</option>
            <option value="0">Ẩn</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link
            href="/admin/banner"
            className="px-6 py-3 rounded-lg border hover:bg-gray-100"
          >
            Hủy
          </Link>

          <button
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Đang lưu..." : "Thêm banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
