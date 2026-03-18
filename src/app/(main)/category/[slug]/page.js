'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import ProductService from "../../../../../services/ProductService";
import CategoryService from "../../../../../services/CategoryService";

export default function CategoryPage({ params }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Chờ params được resolve (Fix lỗi Next.js params)
      const resolvedParams = await params;
      const categorySlug = resolvedParams.slug;

      // 2. Lấy danh sách danh mục
      const categoriesRes = await CategoryService.getList();
      const currentCategory = categoriesRes?.data?.find(cat => cat.slug === categorySlug);

      if (!currentCategory) {
        setError("Danh mục không tồn tại");
        return;
      }

      // 3. Lấy sản phẩm (Lưu ý: Truyền limit lớn để lấy đủ sản phẩm nếu không dùng filter ở backend)
      const productsRes = await ProductService.getList(1, 1000, ""); 
      
      // 4. Lọc sản phẩm
      // Dùng == thay vì === để tránh lỗi lệch kiểu dữ liệu (string vs number)
      let categoryProducts = [];
      if (productsRes?.data) {
        categoryProducts = productsRes.data.filter(
          product => product.category_id == currentCategory.id
        );
      }

      setCategory(currentCategory);
      setProducts(categoryProducts);

    } catch (err) {
      console.error("Lỗi:", err);
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  fetchCategoryData();
}, [params]); // Thêm params vào dependency arra

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-1 flex justify-center md:justify-start">
                <Link href="/" className="text-3xl font-extrabold tracking-wide hover:text-gray-700 transition-colors">
                  BAG SHOP
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh mục...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-1 flex justify-center md:justify-start">
                <Link href="/" className="text-3xl font-extrabold tracking-wide hover:text-gray-700 transition-colors">
                  BAG SHOP
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy danh mục</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Category not found - this shouldn't happen since we check above, but just in case
  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Danh mục không tồn tại</h2>
            <p className="text-gray-600 mb-6">Danh mục bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Trang chủ</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-black font-medium">{category.name}</span>
        </div>
      </div>

      {/* Category Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600">
          Khám phá bộ sưu tập {category.name.toLowerCase()} của chúng tôi - được chế tác với độ chính xác và phong cách.
        </p>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-gray-600">{products.length} Sản phẩm</p>
              <select className="border border-gray-300 px-4 py-2 rounded text-sm">
                <option>Sắp xếp: Nổi bật</option>
                <option>Giá: Thấp đến cao</option>
                <option>Giá: Cao đến thấp</option>
                <option>Mới nhất</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.thumbnail_url || `http://localhost/NguyenKhacTrieu_backend/public/storage/${product.thumbnail}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>

                  <h3 className="text-lg font-medium mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-xl font-bold mb-4 text-rose-600">
                    {product.price_buy ? `${product.price_buy.toLocaleString()}₫` : "Liên hệ"}
                  </p>

                  <button className="w-full border-2 border-black py-3 rounded-full font-medium hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    Thêm vào giỏ
                  </button>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-2">Chưa có sản phẩm trong danh mục này.</p>
            <p className="text-sm text-gray-400 mb-6">Hãy quay lại sau để xem những sản phẩm mới!</p>
            <Link
              href="/"
              className="inline-block border-2 border-black px-8 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
