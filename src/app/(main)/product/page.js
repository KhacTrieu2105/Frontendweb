"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Heart, User, Menu, X, Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import ProductService from "../../../../services/ProductService";

export default function ProductPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Lấy danh sách sản phẩm
      const response = await ProductService.getList(1, 100, "");

      if (response.status === true) {
        // LỌC SẢN PHẨM: Chỉ giữ lại sản phẩm có số lượng (qty) lớn hơn 0
        const availableProducts = response.data.filter(product => product.qty > 0);
        setProducts(availableProducts);
      } else {
        setError("Không lấy được danh sách sản phẩm");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  // Listen for product updates from admin
  useEffect(() => {
    const checkForUpdate = () => {
      if (typeof window !== "undefined") {
        const updatedFlag = localStorage.getItem("product-updated");
        const forceRefreshTrigger = localStorage.getItem("force-refresh-trigger");

        if (updatedFlag || forceRefreshTrigger) {
          // Kiểm tra xem update có gần đây không (trong vòng 30 giây)
          const updateTime = parseInt(updatedFlag || forceRefreshTrigger);
          const now = Date.now();
          const timeDiff = now - updateTime;

          if (timeDiff < 30000) { // 30 seconds
            localStorage.removeItem("product-updated");
            localStorage.removeItem("last-updated-product-id");
            localStorage.removeItem("force-refresh-trigger");

            console.log("Product updated recently, refreshing public product list...");
            // Delay 1000ms để đảm bảo Server đã xử lý xong
            setTimeout(() => {
              setRefreshKey(prev => prev + 1);
            }, 1000);
          } else {
            // Xóa flag cũ
            localStorage.removeItem("product-updated");
            localStorage.removeItem("last-updated-product-id");
            localStorage.removeItem("force-refresh-trigger");
          }
        }
      }
    };

    checkForUpdate();

    // Listen for storage changes (cross-window communication)
    const handleStorageChange = (e) => {
      if (e.key === "force-refresh-trigger" || e.key === "product-updated") {
        console.log("Public page storage changed, checking for updates...");
        checkForUpdate();
      }
    };

    const handleFocus = () => {
      if (!loading) {
        console.log("Public product page focused, checking for updates...");
        checkForUpdate();
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        console.log("Public product page visible, checking for updates...");
        checkForUpdate();
      }
    };

    const handleRefresh = (e) => {
      console.log("Public product page received refresh event:", e.detail);
      if (e.detail?.from === "edit-product" || e.detail?.source === "product-update") {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("product-list-refresh", handleRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("product-list-refresh", handleRefresh);
    };
  }, [loading]);

  return (
    <div className="min-h-screen bg-white">
      {/* BANNER */}
      <section className="relative h-96 mt-10">
        <img 
          src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Bag collection banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            Our Product Collection
          </h2>
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">All Products</h2>

        {loading && (
          <div className="text-center py-20 text-xl animate-pulse">Đang tải sản phẩm...</div>
        )}

        {error && (
          <div className="text-center py-20 text-xl text-red-600">{error}</div>
        )}

        {/* Hiển thị thông báo nếu không có sản phẩm nào có số lượng > 0 */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">Hiện tại sản phẩm đã hết hàng. Vui lòng quay lại sau!</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="group block transform transition hover:-translate-y-2"
              >
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {product.thumbnail_url ? (
                      <img
                        /* Thêm timestamp để xóa cache trình duyệt cho ảnh */
                        src={`${product.thumbnail_url}?t=${refreshKey}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Error"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                        No img
                      </div>
                    )}
                    
                    {/* Badge hiển thị số lượng còn lại (tùy chọn) */}
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-semibold text-gray-600">
                      Còn lại: {product.qty}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mt-2 truncate">{product.name}</h3>
                    <p className="text-xl font-bold text-rose-600 mt-1">
                      {Number(product.price_buy).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
