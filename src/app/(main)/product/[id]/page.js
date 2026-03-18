"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductService from "../../../../../services/ProductService";
import {
  Heart,
  Star,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

// Hook giỏ hàng giữ nguyên logic của bạn
const useUserCart = () => {
  const addToCart = (product, quantity = 1) => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return false;
    }
    const user = JSON.parse(savedUser);
    const cartKey = `cart_user_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price_buy: product.price_buy,
        thumbnail: product.thumbnail,
        thumbnail_url: product.thumbnail_url,
        quantity: quantity,
      });
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
    return true;
  };
  return { addToCart };
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const { addToCart } = useUserCart();

  const fetchRelatedProducts = async (categoryId, excludeId) => {
    if (!categoryId) return;

    setRelatedLoading(true);
    try {
      const res = await ProductService.getList(1, 8, "", categoryId);
      if (res?.data) {
        // Filter out current product and limit to 8 items
        const filtered = res.data.filter(p => p.id != excludeId).slice(0, 8);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getDetail(id);
        const productData = response.data?.data || response.data;
        if (!productData) {
          setError("Sản phẩm không tồn tại");
          return;
        }
        setProduct(productData);
        setMainImage(productData.thumbnail_url || "/placeholder.jpg");

        // Fetch related products from same category
        if (productData.category_id) {
          fetchRelatedProducts(productData.category_id, id);
        }
      } catch (err) {
        setError("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (addToCart(product, quantity)) {
      // Có thể thêm toast notification ở đây thay vì alert
      alert("Đã thêm vào giỏ hàng thành công!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-medium">Đang tải tuyệt tác...</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb nhẹ nhàng */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-black transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/product" className="hover:text-black transition">Cửa hàng</Link>
        <span>/</span>
        <span className="text-black truncate max-w-[200px]">{product?.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CỘT TRÁI: HÌNH ẢNH (5/12) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative group overflow-hidden rounded-3xl bg-[#f9f9f9] border border-gray-100">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full aspect-[4/5] object-contain mix-blend-multiply transform transition-transform duration-700 group-hover:scale-105"
              />
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition"
              >
                <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
              
              {/* Badge ưu đãi */}
              <div className="absolute top-6 left-6 bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest">
                NEW ARRIVAL
              </div>
            </div>

            {/* Gallery ảnh phụ (nếu có dữ liệu gallery bạn có thể map ở đây) */}
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map((i) => (
                 <div key={i} className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:border-black transition overflow-hidden">
                    <img src={mainImage} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition" />
                 </div>
               ))}
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN (5/12) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-8">
               <span className="text-rose-600 text-sm font-bold tracking-widest uppercase mb-2 block">Premium Collection</span>
               <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                 {product.name}
               </h1>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="font-bold text-yellow-700 text-sm">4.9</span>
                  </div>
                  <span className="text-gray-400 text-sm border-l pl-4">120 Đã bán</span>
                  <span className="text-green-600 text-sm font-semibold ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Còn hàng
                  </span>
               </div>
            </div>

            <div className="mb-10">
               <div className="flex items-baseline gap-4">
                 <span className="text-5xl font-black text-rose-600">
                   {Number(product.price_buy).toLocaleString("vi-VN")}₫
                 </span>
                 <span className="text-gray-400 line-through text-xl">
                    {(Number(product.price_buy) * 1.2).toLocaleString("vi-VN")}₫
                 </span>
               </div>
            </div>

            {/* Thuộc tính sản phẩm dạng Grid hiện đại */}
            {product.formatted_attributes?.length > 0 && (
              <div className="grid grid-cols-2 gap-y-6 gap-x-10 p-6 bg-gray-50 rounded-3xl mb-8">
                {product.formatted_attributes.map((attr) => (
                  <div key={attr.attribute_id} className="flex flex-col gap-1">
                    <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">{attr.attribute_name}</span>
                    <span className="text-gray-900 font-semibold">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Số lượng và Nút hành động */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-inner relative z-20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition shadow-sm active:scale-90 relative z-30"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-black text-xl relative z-20">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition shadow-sm active:scale-90 relative z-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  Mua càng nhiều <br/> ưu đãi càng lớn
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-[2] bg-black text-white h-16 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-black/10"
                >
                  <ShoppingBag size={20} />
                  THÊM VÀO GIỎ
                </button>
                <button className="flex-1 border-2 border-black h-16 rounded-2xl font-bold hover:bg-black hover:text-white transition-all active:scale-[0.98]">
                  MUA NGAY
                </button>
              </div>
            </div>

            {/* Cam kết thương hiệu */}
            <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
               <div className="flex flex-col items-center text-center gap-2">
                 <Truck size={20} className="text-gray-400" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase">Giao nhanh 2h</span>
               </div>
               <div className="flex flex-col items-center text-center gap-2 border-x border-gray-100">
                 <ShieldCheck size={20} className="text-gray-400" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase">Bảo hành 12th</span>
               </div>
               <div className="flex flex-col items-center text-center gap-2">
                 <RotateCcw size={20} className="text-gray-400" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase">Đổi trả 30 ngày</span>
               </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        <div className="mt-20 pt-16 border-t border-gray-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} />
              Khám phá thêm
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Sản phẩm liên quan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm tương tự mà bạn có thể quan tâm, cùng danh mục và phong cách
            </p>
          </div>

          {relatedLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Đang tìm sản phẩm phù hợp...</p>
              </div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group block bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-rose-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    {relatedProduct.thumbnail_url ? (
                      <img
                        src={relatedProduct.thumbnail_url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ShoppingBag size={32} className="text-gray-400" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(relatedProduct, 1);
                            alert(`Đã thêm "${relatedProduct.name}" vào giỏ hàng!`);
                          }}
                          className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
                        >
                          <ShoppingBag size={16} />
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {relatedProduct.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="fill-yellow-400 text-yellow-400" size={14} />
                        <span className="text-sm font-medium text-yellow-700">4.8</span>
                      </div>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        relatedProduct.status == 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {relatedProduct.status == 1 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-rose-600">
                          {Number(relatedProduct.price_buy).toLocaleString("vi-VN")}₫
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {(Number(relatedProduct.price_buy) * 1.2).toLocaleString("vi-VN")}₫
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Heart size={14} className="text-red-400" />
                        <span>128</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sparkles size={64} className="text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không có sản phẩm liên quan</h3>
              <p className="text-gray-600 mb-6">
                Sản phẩm này có thể là sản phẩm duy nhất trong danh mục của nó
              </p>
              <Link
                href="/product"
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all"
              >
                <ShoppingBag size={20} />
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
