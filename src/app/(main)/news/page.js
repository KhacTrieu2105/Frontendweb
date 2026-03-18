'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostService from "../../../../services/PostService";
import { ShoppingBag, Search, Heart, User, Menu, X, Calendar, ChevronLeft, ChevronRight,Facebook,Instagram,Youtube, AlertCircle } from 'lucide-react';

export default function NewsListPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 9,
          search: searchTerm || undefined
        };
        console.log("Fetching posts with params:", params);
        const response = await PostService.getList(params);
        console.log("Posts list response:", response);
        if (response?.data) {
          console.log("Posts data:", response.data);
          setPosts(response.data);
          // Calculate total pages from response
          const total = response.total || response.data.length;
          setTotalPages(Math.ceil(total / 9));
        } else {
          console.log("No data in posts response");
          setError("Không thể tải danh sách bài viết");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchTerm]);

  return (
    <div className="min-h-screen bg-white">

     
    

      {/* NỘI DUNG DANH SÁCH BÀI VIẾT */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Tin tức & Blog</h1>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải tin tức...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không thể tải tin tức</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Danh sách bài viết */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map(post => (
                <article key={post.id} className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <Link href={`/news/${post.slug || post.id}`}>
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      {post.image ? (
                        <img
                          src={`http://localhost/NguyenKhacTrieu_backend/public/storage/${post.image}`}
                          alt={post.title}
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
                        <Calendar size={16} />
                        <span>
                          {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "N/A"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-gray-700 line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4">
                          {post.description.length > 150
                            ? `${post.description.substring(0, 150)}...`
                            : post.description
                          }
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 text-black font-semibold hover:text-gray-700 transition-colors">
                        Đọc thêm
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-lg font-medium px-4">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? "Không tìm thấy bài viết" : "Chưa có bài viết nào"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Hãy thử tìm kiếm với từ khóa khác"
                : "Các bài viết sẽ xuất hiện tại đây"
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </main>

  
    </div>
  );
}
