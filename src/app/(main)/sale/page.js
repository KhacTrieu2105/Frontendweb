"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import promotionService from "../../../../services/promotionService";
import {
  ShoppingBag, Search, Heart, User, Menu, X,
  Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock,
  ChevronRight, Star, Sparkles, Shield, Truck, Tag
} from "lucide-react";

export default function SalePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách khuyến mãi từ API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const res = await promotionService.getList();

        if (res.status === true) {
          const list = res.data?.data || res.data || [];
          setPromotions(list);
        }
      } catch (err) {
        console.error("Load sale products error:", err);
        alert("Không thể tải sản phẩm khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* =================== HEADER =================== */}
   
      {/* =================== HERO BANNER SALE =================== */}
      <section className="relative h-screen overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/3363723/pexels-photo-3363723.jpeg?auto=compress&cs=tinysrgb&w=1600" 
          className="w-full h-full object-cover" 
          alt="Sale collection" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-rose-800/70 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <div className="inline-block bg-yellow-400 text-rose-900 px-6 py-3 rounded-full font-bold text-xl mb-6 animate-pulse">
              <Tag className="inline mr-2" size={24} />
              FLASH SALE – GIẢM ĐẾN 40%
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Sale Đặc Biệt<br />Chỉ Có Tại Ánh Tuyết
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl opacity-90">
              Cơ hội sở hữu túi xách cao cấp với giá tốt nhất trong năm. Chỉ trong thời gian có hạn!
            </p>
            <Link 
              href="#products" 
              className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-5 px-12 rounded-full text-lg shadow-xl transition transform hover:scale-105"
            >
              Mua ngay hôm nay <ChevronRight size={26} />
            </Link>
          </div>
        </div>
      </section>

      {/* =================== SẢN PHẨM SALE =================== */}
      <section className="py-20 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Sản phẩm đang giảm giá 
              <span className="text-rose-600">({promotions.length})</span>
            </h2>
            <p className="text-gray-600 text-lg">Đừng bỏ lỡ cơ hội sở hữu túi xách cao cấp với giá ưu đãi!</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Đang tải sản phẩm khuyến mãi...</div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
              <p className="text-2xl font-medium text-gray-600">Hiện chưa có chương trình khuyến mãi nào</p>
              <p className="text-gray-500 mt-4">Hãy theo dõi để nhận thông báo sale sớm nhất!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {promotions.map((item) => (
                <ProductCard key={item.id} promotion={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =================== LỢI ÍCH SALE =================== */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tại Sao Nên Mua Sale Tại Ánh Tuyết?</h2>
            <p className="text-gray-600 text-lg">Chất lượng không đổi – Giá cực tốt</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-12 h-12 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chính Hãng 100%</h3>
              <p className="text-gray-600 leading-relaxed">Sản phẩm sale vẫn là hàng chính hãng, đầy đủ giấy tờ và bảo hành</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="w-12 h-12 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Miễn Phí Vận Chuyển</h3>
              <p className="text-gray-600 leading-relaxed">Freeship toàn quốc cho mọi đơn hàng sale</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-12 h-12 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bảo Hành Trọn Đời</h3>
              <p className="text-gray-600 leading-relaxed">Vẫn áp dụng chính sách bảo hành trọn đời như sản phẩm thường</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

// Product Card cho sản phẩm khuyến mãi
function ProductCard({ promotion }) {
  const originalPrice = promotion.original_price || 0;
  const salePrice = promotion.sale_price || 0;
  const discountPercent = promotion.discount_percent || 0;

  return (
    <Link href={`/product/${promotion.product_id || promotion.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition duration-500">
        <div className="aspect-square relative">
          <img 
            src={promotion.image || "/placeholder.jpg"} 
            alt={promotion.product_name} 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
          />
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              GIẢM {discountPercent}%
            </span>
          )}
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-16 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white p-4 rounded-full shadow-xl">
            <ShoppingBag size={22} className="text-gray-800" />
          </button>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {promotion.product_name || "Sản phẩm khuyến mãi"}
          </h3>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-2xl font-bold text-rose-600">
              {Number(salePrice).toLocaleString("vi-VN")}₫
            </span>
            {originalPrice > salePrice && (
              <span className="text-gray-400 line-through text-lg">
                {Number(originalPrice).toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500 fill-current" />
            <Star size={18} className="text-yellow-500 fill-current" />
            <Star size={18} className="text-yellow-500 fill-current" />
            <Star size={18} className="text-yellow-500 fill-current" />
            <Star size={18} className="text-gray-300" />
            <span className="text-sm text-gray-500">(28)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}