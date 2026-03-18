"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "../../../components/ScrollReveal";
import ProductService from "../../../services/ProductService";
import promotionService from "../../../services/promotionService";
import CategoryService from "../../../services/CategoryService";
import PostService from "../../../services/PostService";

import { 
  ShoppingBag, Search, Heart, User, Menu, X, 
  Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock,
  ChevronRight, Star, Sparkles, Shield, Truck
} from 'lucide-react';



export default function HomePage() {
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingSale, setLoadingSale] = useState(true);
  const [loadingCate, setLoadingCate] = useState(true);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [errorCate, setErrorCate] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();

  // 1. Load sản phẩm mới nhất & Lọc qty > 0
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoadingNew(true);
        const response = await ProductService.getList(1, 40); // Lấy nhiều hơn để trừ hao sau khi lọc
        const list = response.data?.data || response.data || [];
        
        // CHỈ LẤY SẢN PHẨM CÓ SỐ LƯỢNG > 0
        const filtered = list.filter(p => (p.qty ?? 0) > 0);
        setNewProducts(filtered);
      } catch (err) {
        console.error("Load new products error:", err);
      } finally {
        setLoadingNew(false);
      }
    };
    fetchNewProducts();
  }, []);

  // 2. Load sản phẩm khuyến mãi & Lọc qty > 0
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setLoadingSale(true);
        console.log("🔍 Fetching sale products...");
        const res = await promotionService.getList();
        console.log("📦 Sale products API response:", res);

        if (res.status === true) {
          const list = res.data?.data || res.data || [];
          console.log("📋 Raw promotion list:", list);

          // LỌC SẢN PHẨM KHUYẾN MÃI CÒN HÀNG
          const filtered = list.filter(promo => {
            const realProduct = promo.product ?? promo;
            const hasStock = (realProduct.qty ?? 0) > 0;
            console.log(`🔍 Product ${realProduct.id}: qty=${realProduct.qty}, hasStock=${hasStock}`);
            return hasStock;
          });

          console.log("✅ Filtered sale products:", filtered);
          setSaleProducts(filtered);
        } else {
          console.log("❌ Sale products API returned status false");
        }
      } catch (err) {
        console.error("❌ Load sale products error:", err);
        console.error("❌ Error details:", err.response?.data);
      } finally {
        setLoadingSale(false);
      }
    };
    fetchSaleProducts();
  }, []);

  // 3. Load Danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCate(true);
        const res = await CategoryService.getList();
        const list = res.data?.data || res.data || [];
        setCategories(list);
      } catch (err) {
        setErrorCate("Không tải được danh mục");
      } finally {
        setLoadingCate(false);
      }
    };
    fetchCategories();
  }, []);

  // 4. Load bài viết/blog
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoadingBlog(true);
        const res = await PostService.getList({ page: 1, limit: 3 });
        const posts = res.data?.data || res.data || [];
        setBlogPosts(posts);
      } catch (err) {
        console.error("Load blog posts error:", err);
        // Fallback to mock data if API fails
        setBlogPosts([
          { id: 1, title: "Xu hướng túi xách mùa Thu Đông 2025", created_at: "2025-11-15", description: "Những mẫu túi hot nhất đang làm mưa làm gió...", image: "https://images.pexels.com/photos/2738792/pexels-photo-2738792.jpeg?auto=compress&cs=tinysrgb&w=800" },
          { id: 2, title: "Cách chọn túi phù hợp với dáng người", created_at: "2025-11-10", description: "Bí quyết giúp bạn luôn nổi bật với chiếc túi hoàn hảo...", image: "https://images.pexels.com/photos/17819712/pexels-photo-17819712.jpeg?auto=compress&cs=tinysrgb&w=800" },
          { id: 3, title: "Chính sách bảo hành trọn đời – Cam kết từ BAG SHOP", created_at: "2025-11-05", description: "Chúng tôi bảo hành sản phẩm của bạn suốt đời...", image: "https://images.pexels.com/photos/3363723/pexels-photo-3363723.jpeg?auto=compress&cs=tinysrgb&w=800" },
        ]);
      } finally {
        setLoadingBlog(false);
      }
    };
    fetchBlogPosts();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "0₫";
    return Number(price).toLocaleString("vi-VN") + "₫";
  };

  // Component Card sản phẩm dùng chung
  function ProductCard({ product }) {
    const realProduct = product.product ?? product;
    
    // Safety check: Không render nếu hết hàng
    if ((realProduct.qty ?? 0) <= 0) return null;

    const thumbnailUrl = realProduct.thumbnail_url || (realProduct.thumbnail ? `/storage/${realProduct.thumbnail}` : "/placeholder.jpg");
    const originalPrice = product.original_price ?? realProduct.price_buy ?? realProduct.price;
    const salePrice = product.sale_price ?? realProduct.price_buy ?? realProduct.price;
    const discountPercent = product.discount_percent ?? 0;

    return (
      <Link href={`/product/${realProduct.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition duration-500">
          <div className="aspect-square relative">
            <img
              src={thumbnailUrl}
              alt={realProduct.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
            />

            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                -{discountPercent}%
              </span>
            )}
            
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm uppercase font-medium">
              Còn lại: {realProduct.qty}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 min-h-[3rem]">
              {realProduct.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-rose-600">{formatPrice(salePrice)}</span>
              {discountPercent > 0 && (
                <span className="text-gray-400 line-through text-xs">{formatPrice(originalPrice)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO BANNER */}
      <ScrollReveal>
        <section className="relative h-[80vh] md:h-screen overflow-hidden">
          <img src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600" className="w-full h-full object-cover" alt="Luxury collection" />
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="max-w-7xl mx-auto px-6 text-white">
              <p className="text-rose-400 font-semibold text-lg mb-4 uppercase tracking-widest">Bộ sưu tập 2025</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Gift Yourself<br />First.</h1>
              <Link href="/product" className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-10 rounded-full transition shadow-xl">
                Mua ngay <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* GIỚI THIỆU */}
      <ScrollReveal>
        <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100 rounded-full translate-x-1/2 translate-y-1/2 opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
                  <Sparkles size={16} />
                  Về chúng tôi
                </div>

                <h2 className="text-5xl font-black mb-8 leading-tight">
                  Trải nghiệm <span className="text-rose-600">đẳng cấp</span> với<br />
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">BAGSTORE</span>
                </h2>

                <p className="text-xl text-gray-600 leading-relaxed mb-10 italic">
                  "Đẳng cấp không chỉ là sở hữu, mà là cách bạn thể hiện phong cách sống. Chúng tôi mang đến những sản phẩm tinh hoa, dịch vụ hoàn hảo và trải nghiệm mua sắm vượt trội."
                </p>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                      <Shield className="text-rose-600" size={24} />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-wider">Da thật 100%</p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <Clock className="text-blue-600" size={24} />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-wider">Bảo hành trọn đời</p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <Truck className="text-green-600" size={24} />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-wider">Free Ship</p>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-sm font-medium">10,000+ khách hàng hài lòng</span>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2 relative">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="About BAGSTORE"
                    className="rounded-3xl shadow-2xl w-full h-auto"
                  />

                  {/* Floating testimonial */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 max-w-xs">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="text-yellow-400 fill-current" size={12} />)}
                    </div>
                    <p className="text-sm text-gray-600 italic mb-2">"Sản phẩm tuyệt vời, chất lượng vượt trội!"</p>
                    <p className="text-xs font-bold text-gray-800">Nguyễn Thị A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* DANH MỤC */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-widest">Danh mục sản phẩm</h2>
          {loadingCate ? <div className="text-center py-10">Đang tải...</div> : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group text-center">
                  <div className="aspect-square rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg group-hover:border-rose-200 transition">
                    <img src={cat.image ? `/image/${cat.image}` : "/placeholder.jpg"} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <h3 className="font-bold text-sm uppercase group-hover:text-rose-600 transition">{cat.name}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SẢN PHẨM MỚI (Lọc qty > 0) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Sản phẩm nổi bật</h2>
            <Link href="/product" className="text-rose-600 font-bold hover:underline">Xem tất cả</Link>
          </div>
          {loadingNew ? <div className="text-center py-20 animate-pulse">Đang cập nhật kho hàng...</div> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newProducts.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* HOT SALE (Lọc qty > 0) */}
      <section className="py-20 bg-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-12 italic uppercase tracking-tighter">Ưu đãi cực sốc - Hot Sale</h2>
          {loadingSale ? <div className="text-center py-10">Đang tải deal ngon...</div> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {saleProducts.slice(0, 4).map(promo => <ProductCard key={promo.id} product={promo} />)}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <ScrollReveal>
        <section className="py-20 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
                <Star className="text-yellow-500" size={16} />
                Khách hàng nói gì
              </div>
              <h2 className="text-4xl font-black mb-4">Ý kiến từ khách hàng</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Những đánh giá chân thực từ khách hàng đã tin tưởng và lựa chọn BAGSTORE</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Nguyễn Thị Mai",
                  role: "Khách hàng VIP",
                  avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
                  rating: 5,
                  review: "Sản phẩm tuyệt vời với chất lượng vượt trội! Tôi đã mua 3 túi ở đây và đều rất hài lòng. Dịch vụ khách hàng cũng rất chuyên nghiệp."
                },
                {
                  name: "Trần Văn Hoàng",
                  role: "Doanh nhân",
                  avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
                  rating: 5,
                  review: "BAGSTORE là địa chỉ uy tín để mua túi xách cao cấp. Giá cả hợp lý, chất lượng đảm bảo và giao hàng nhanh chóng."
                },
                {
                  name: "Lê Thị Linh",
                  role: "Nhân viên văn phòng",
                  avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
                  rating: 5,
                  review: "Tôi rất thích phong cách phục vụ của BAGSTORE. Tư vấn viên nhiệt tình và chuyên nghiệp. Sẽ tiếp tục ủng hộ!"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`text-yellow-400 fill-current ${i <= testimonial.rating ? '' : 'opacity-30'}`} size={16} />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 leading-relaxed">"{testimonial.review}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-800">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* BLOG */}
      <ScrollReveal>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold uppercase">Tin tức & Xu hướng</h2>
              <Link href="/news" className="text-rose-600 font-bold hover:underline">Xem tất cả</Link>
            </div>
            {loadingBlog ? <div className="text-center py-10 animate-pulse">Đang tải tin tức...</div> : (
              <div className="grid md:grid-cols-3 gap-8">
                {blogPosts.slice(0, 3).map(post => (
                  <Link key={post.id} href={`/news/${post.slug || post.id}`} className="group block">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={post.image ? `http://localhost/NguyenKhacTrieu_backend/public/storage/${post.image}` : "https://via.placeholder.com/400x300?text=No+Image"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-xs text-rose-600 font-bold mb-2">
                          {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "N/A"}
                        </p>
                        <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-rose-600 transition">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {post.description || post.content?.substring(0, 100) + "..." || "Nội dung bài viết..."}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* CTA SECTION */}
      <ScrollReveal>
        <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-black mb-6">
              Sẵn sàng nâng tầm<br />
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Phong cách</span> của bạn?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Khám phá bộ sưu tập túi xách cao cấp với chất lượng thượng hạng và thiết kế tinh tế. Mỗi sản phẩm đều là một tác phẩm nghệ thuật.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/product"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-2xl shadow-rose-500/25 hover:shadow-3xl hover:shadow-rose-500/40 transform hover:scale-105"
              >
                Khám phá ngay
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
