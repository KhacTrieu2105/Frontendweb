// app/news/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostService from "../../../../../services/PostService";
import { ShoppingBag, Search, Heart, User, Menu, X, Calendar, Clock, ChevronLeft, AlertCircle, Eye, Share2 } from 'lucide-react';

export default function NewsDetailPage({ params }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
  try {
    setLoading(true);
    const resolvedParams = await params;
    const identifier = resolvedParams.slug;

    // Gọi API
    const response = await PostService.getBySlug(identifier);
    
    // LOG ĐỂ KIỂM TRA: Hãy mở F12 để xem dòng này
    console.log("Full Response from API:", response);

    // Kiểm tra cấu trúc: response.data là dữ liệu từ Axios
    // response.data.data là object 'post' từ Laravel trả về
    if (response && response.data) {
        if (response.data.status === true) {
            setPost(response.data.data); // Đây là nơi chứa object bài viết
        } else {
            setPost(response.data); // Dự phòng nếu service đã bóc tách sẵn
        }
    } else {
        setError("Không nhận được dữ liệu từ máy chủ");
    }
  } catch (err) {
      console.error("Fetch Error:", err);
      setError("Bài viết không tồn tại hoặc lỗi kết nối");
  } finally {
      setLoading(false);
  }
};

    fetchPost();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
            
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h2>
            <p className="text-gray-600 mb-6">{error || "Bài viết có thể đã bị xóa hoặc không tồn tại."}</p>
            <Link
              href="/news"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all"
            >
              Quay lại tin tức
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
  
     

      {/* NỘI DUNG CHI TIẾT */}
      <article className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/news" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors">
          <ChevronLeft size={20} /> Quay lại tin tức
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{post.title}</h1>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>{post.id} lượt xem</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-12">
            <img
              src={`http://localhost/NguyenKhacTrieu_backend/public/storage/${post.image}`}
              alt={post.title}
              className="w-full rounded-2xl shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-16">
          {post.description ? (
            <div className="text-lg leading-relaxed whitespace-pre-line border-l-4 border-rose-500 pl-6 mb-8 italic text-gray-600">
              {post.description}
            </div>
          ) : null}

          <div className="text-base leading-relaxed">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-gray-500 italic">Nội dung bài viết đang được cập nhật...</p>
            )}
          </div>
        </div>

        {/* Share Section */}
        <div className="border-t border-b border-gray-200 py-8 mb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Chia sẻ bài viết:</span>
              <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Heart size={16} />
              <span>Thích bài viết này</span>
            </div>
          </div>
        </div>

        {/* Bài viết liên quan */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                <Eye size={16} className="text-rose-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Bài viết liên quan</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map(related => (
                <Link
                  key={related.id}
                  href={`/news/${related.slug || related.id}`}
                  className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-rose-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {related.image ? (
                      <img
                        src={`http://localhost/NguyenKhacTrieu_backend/public/storage/${related.image}`}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400 text-sm">No Image</span></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">No Image</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span>
                        {related.created_at ? new Date(related.created_at).toLocaleDateString("vi-VN") : "N/A"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-rose-600 line-clamp-2 mb-3 transition-colors">
                      {related.title}
                    </h3>
                    {related.description && (
                      <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-4">
                        {related.description.length > 100
                          ? `${related.description.substring(0, 100)}...`
                          : related.description
                        }
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-black font-semibold hover:text-rose-600 transition-colors">
                      Đọc thêm
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* FOOTER */}
     
    </div>
  );
}
