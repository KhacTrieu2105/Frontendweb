"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Calendar, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import BannerService from "../../../../../../services/BannerService";

export default function BannerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;

    try {
      await BannerService.delete(id);
      alert("Xóa banner thành công!");
      router.push("/admin/banner");
    } catch (err) {
      alert("Không thể xóa banner!");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchBanner = async () => {
      try {
        setLoading(true);
        const res = await BannerService.getById(id);
        if (res.data) {
          setBanner(res.data);
        } else {
          setError("Không tìm thấy banner");
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
        setError("Không thể tải thông tin banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-600">Đang tải thông tin banner...</p>
        </div>
      </div>
    );
  }

  if (error || !banner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy banner</h2>
          <p className="text-gray-600 mb-6">{error || "Banner có thể đã bị xóa hoặc không tồn tại."}</p>
          <Link
            href="/admin/banner"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/banner"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft size={20} /> Quay lại danh sách
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chi tiết Banner</h1>
              <p className="text-gray-600 mt-1">#{banner.id} - {banner.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {banner.image_url ? (
                  <img
                    src={banner.image_url}
                    alt={banner.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x400?text=Lỗi+đường+dẫn+ảnh";
                    }}
                  />
                ) : banner.image ? (
                  <img
                    src={`http://localhost/NguyenKhacTrieu_backend/public/storage/${banner.image.replace(/^.*[\\/]/, '')}`}
                    alt={banner.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x400?text=Lỗi+đường+dẫn+ảnh";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <ImageIcon size={48} className="mx-auto mb-2" />
                      <p>Chưa có ảnh</p>
                    </div>
                  </div>
                )}

                {/* Position Badge */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {banner.position}
                </div>

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                  banner.status == 1
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                }`}>
                  {banner.status == 1 ? 'Đang hiển thị' : 'Đã ẩn'}
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin cơ bản</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tên banner</label>
                  <p className="text-gray-900 font-medium">{banner.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Vị trí</label>
                  <p className="text-gray-900 font-medium capitalize">{banner.position}</p>
                </div>

                {banner.link && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Liên kết</label>
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <LinkIcon size={14} />
                      {banner.link}
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Thứ tự</label>
                  <p className="text-gray-900 font-medium">{banner.sort_order || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                  <div className="flex items-center gap-1 text-gray-900">
                    <Calendar size={14} />
                    <span>{banner.created_at ? new Date(banner.created_at).toLocaleDateString("vi-VN") : "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/banner/${banner.id}/edit`}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </Link>

                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa banner
                </button>
              </div>
            </div>

            {/* Description */}
            {banner.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed">{banner.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
