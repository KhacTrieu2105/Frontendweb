"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, Search, Heart, User, Menu, X, 
  Facebook, Instagram, Youtube, Phone, Mail, MapPin, 
  ChevronDown, Clock, ShieldCheck, RefreshCw, Truck,
  LogOut
} from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const categoriesMenu = [
  { name: "Túi Xách Tay", slug: "tui-xach-tay" },
  { name: "Túi Đeo Chéo", slug: "tui-deo-cheo" },
  { name: "Ví & Clutch", slug: "vi-clutch" },
  { name: "Balo Thời Trang", slug: "balo" },
];

export default function RootLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const router = useRouter();

  // Hàm lấy giỏ hàng theo user
  const getCartForUser = (userId) => {
    if (!userId) return [];
    const saved = localStorage.getItem(`cart_user_${userId}`);
    return saved ? JSON.parse(saved) : [];
  };

  // Hàm tính tổng số lượng
  const calculateCartCount = (cart) => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  useEffect(() => {
    const updateHeaderState = () => {
      // Cập nhật user
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Load giỏ hàng riêng của user này
        const userCart = getCartForUser(parsedUser.id);
        setCartCount(calculateCartCount(userCart));
      } else {
        setUser(null);
        setCartCount(0);
      }
    };

    updateHeaderState();

    // Lắng nghe thay đổi cart hoặc login/logout
    window.addEventListener("cartUpdated", updateHeaderState);
    window.addEventListener("storage", updateHeaderState);
    window.addEventListener("userUpdated", updateHeaderState); // thêm event nếu cần

    return () => {
      window.removeEventListener("cartUpdated", updateHeaderState);
      window.removeEventListener("storage", updateHeaderState);
      window.removeEventListener("userUpdated", updateHeaderState);
    };
  }, []);

  const handleLogout = () => {
    const userId = user?.id;
    // Xóa giỏ hàng của user này (tùy chọn: giữ lại hoặc xóa)
  

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserMenuOpen(false);
    setCartCount(0);

    // Trigger cập nhật header ở các tab khác
    window.dispatchEvent(new Event("storage"));
    router.push("/auth/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900`}>
        {/* HEADER – giữ nguyên như cũ, chỉ thay cartCount đã đúng theo user */}
        <header className="sticky top-0 bg-white z-50 shadow-sm border-b border-gray-100">
          {/* Top Bar */}
          <div className="bg-black text-white text-[10px] md:text-xs py-2 px-4 flex justify-between items-center">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><Phone size={12}/> 0987.xxx.xxx</span>
              <span className="hidden md:flex items-center gap-1"><Clock size={12}/> 8:00 - 21:00</span>
            </div>
            <p className="font-medium uppercase tracking-tighter">Miễn phí vận chuyển từ 500k</p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 gap-4">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link href="/" className="flex flex-col items-center md:items-start group">
                <span className="text-2xl md:text-3xl font-black tracking-tighter group-hover:text-rose-600 transition">BAG STORE</span>
                <span className="hidden md:block text-[9px] font-medium tracking-[0.2em] text-gray-500 uppercase">Luxury Handbags & Style</span>
              </Link>

              {/* Navigation giữ nguyên */}
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <Link href="/" className="text-sm font-bold hover:text-rose-600 transition">TRANG CHỦ</Link>
                <Link href="/news" className="text-sm font-bold hover:text-rose-600 transition">BÀI VIẾT</Link>
                
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm font-bold hover:text-rose-600 transition uppercase">
                    Sản phẩm <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full -left-4 w-56 bg-white border border-gray-100 shadow-2xl rounded-lg py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                    {categoriesMenu.map((cat) => (
                      <Link key={cat.slug} href={`/category/${cat.slug}`} className="block px-6 py-2.5 text-sm hover:bg-rose-50 hover:text-rose-600 transition">
                        {cat.name}
                      </Link>
                    ))}
                    <div className="border-t my-2 mx-4"></div>
                    <Link href="/product" className="block px-6 py-2 text-sm text-rose-600 font-black">XEM TẤT CẢ</Link>
                  </div>
                </div>

                <Link href="/sale" className="text-sm font-bold text-rose-600 animate-pulse">KHUYẾN MÃI</Link>
                <Link href="/contact" className="text-sm font-bold hover:text-rose-600 transition">LIÊN HỆ</Link>
              </nav>

              <div className="flex items-center gap-2 md:gap-5">
                <form onSubmit={handleSearch} className="hidden lg:relative lg:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-40 xl:w-60 pl-10 pr-4 py-2 bg-gray-100 rounded-full text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all outline-none border-none"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </form>

                {/* USER MENU */}
                <div className="relative">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition"
                      >
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <span className="hidden lg:block text-xs font-bold max-w-[80px] truncate uppercase">{user.name}</span>
                        <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {userMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)}></div>
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-20 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tài khoản</p>
                              <p className="text-sm font-bold text-rose-600 truncate">{user.username}</p>
                            </div>
                            <Link href="user/proflie" className="block px-4 py-2 text-sm hover:bg-gray-50 transition" onClick={() => setUserMenuOpen(false)}>Trang cá nhân</Link>
                            <Link href="user/orders" className="block px-4 py-2 text-sm hover:bg-gray-50 transition" onClick={() => setUserMenuOpen(false)}>Đơn hàng của tôi</Link>
                            <div className="border-t border-gray-50 my-1"></div>
                            <button 
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition flex items-center gap-2 font-bold"
                            >
                              <LogOut size={16} /> Đăng xuất
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link href="/auth/login" title="Đăng nhập" className="flex items-center gap-2 hover:text-rose-600 transition">
                      <User size={22} />
                      <span className="hidden lg:block text-xs font-bold uppercase tracking-tighter">Đăng nhập</span>
                    </Link>
                  )}
                </div>
                
                <Link href="/cart" className="relative p-2 hover:bg-rose-50 rounded-full transition" title="Giỏ hàng">
                  <ShoppingBag size={22} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        {/* FOOTER giữ nguyên */}
        <footer className="bg-[#111] text-gray-400 pt-20 pb-10">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
      {/* CỘT 1: GIỚI THIỆU & SOCIAL */}
      <div>
        <Link href="/" className="inline-block mb-6">
          <h2 className="text-3xl font-black text-white tracking-tighter">BAGSTORE</h2>
          <div className="h-1 w-12 bg-rose-600 mt-1"></div>
        </Link>
        <p className="text-sm leading-relaxed mb-8 text-gray-500">
          Thương hiệu túi xách thiết kế cao cấp, mang sứ mệnh định hình phong cách thời trang hiện đại và sang trọng cho phụ nữ Việt Nam.
        </p>
        <div className="flex gap-5">
          <a href="https://www.facebook.com/trieu.mixi" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-300"><Facebook size={18} /></a>
          <a href="https://www.instagram.com/nktrieu2105/" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-300"><Instagram size={18} /></a>
          
        </div>
      </div>

      {/* CỘT 2: HỖ TRỢ KHÁCH HÀNG */}
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Chính sách mua hàng</h4>
        <ul className="space-y-4 text-sm">
          <li><Link href="/chinh-sach-doi-tra" className="hover:text-rose-500 transition">Chính sách đổi trả 30 ngày</Link></li>
          <li><Link href="/chinh-sach-bao-hanh" className="hover:text-rose-500 transition">Chính sách bảo hành trọn đời</Link></li>
          <li><Link href="/chinh-sach-van-chuyen" className="hover:text-rose-500 transition">Chính sách vận chuyển & Kiểm hàng</Link></li>
          <li><Link href="/chinh-sach-bao-mat" className="hover:text-rose-500 transition">Chính sách bảo mật thông tin</Link></li>
          <li><Link href="/huong-dan-chon-size" className="hover:text-rose-500 transition">Hướng dẫn chọn size túi</Link></li>
        </ul>
      </div>

      {/* CỘT 3: THÔNG TIN LIÊN HỆ */}
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Hệ thống cửa hàng</h4>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <MapPin size={20} className="text-rose-600 shrink-0" />
            <span>Showroom 1: 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin size={20} className="text-rose-600 shrink-0" />
            <span>Showroom 2: 456 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội</span>
          </li>
          <li className="flex items-center gap-3">
            <Phone size={18} className="text-rose-600" />
            <span>Hotline: 1900 67xx (8:00 - 22:00)</span>
          </li>
          <li className="flex items-center gap-3">
            <Mail size={18} className="text-rose-600" />
            <span>Email: contact@bagstore.vn</span>
          </li>
        </ul>
      </div>

      {/* CỘT 4: ĐĂNG KÝ NHẬN TIN */}
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Đăng ký nhận ưu đãi</h4>
        <p className="text-xs mb-4 text-gray-500">Nhận thông báo về các bộ sưu tập mới nhất và ưu đãi độc quyền lên đến 50%.</p>
        <form className="flex mb-6">
          <input 
            type="email" 
            placeholder="Email của bạn..." 
            className="bg-[#222] border-none text-xs p-3 rounded-l-md w-full focus:ring-1 focus:ring-rose-600 transition outline-none"
          />
          <button className="bg-rose-600 text-white px-4 rounded-r-md hover:bg-rose-700 transition">
            GỬI
          </button>
        </form>
        <div className="flex items-center gap-3 mt-4">
            {/* Ảnh Đã đăng ký Bộ Công Thương (Dùng URL placeholder hoặc ảnh thật của bạn) */}
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Logo_bo_cong_thuong.cyclone.png/640px-Logo_bo_cong_thuong.cyclone.png" 
                alt="Bộ công thương" 
                className="h-10 opacity-80"
            />
        </div>
      </div>
    </div>

    {/* PHẦN DƯỚI CÙNG (COPYRIGHT & THANH TOÁN) */}
    <div className="border-t border-gray-800 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-[11px] leading-relaxed">
                <p className="text-white font-bold mb-1 tracking-widest uppercase">Công ty TNHH BAGSTORE LUXURY VIỆT NAM</p>
                <p>Số ĐKDN: 0316xxxxxx do Sở KH&ĐT TP.HCM cấp ngày 01/01/2026</p>
                <p>Địa chỉ văn phòng: Tòa nhà Bag Tower, Quận 1, TP. HCM</p>
                <p className="mt-4">© 2026 BAGSTORE LUXURY. ALL RIGHTS RESERVED. DESIGNED BY TRIEU.</p>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-start lg:justify-end items-center">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Phương thức thanh toán:</span>
                <div className="flex gap-4 items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-30 grayscale hover:grayscale-0 transition cursor-pointer" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-30 grayscale hover:grayscale-0 transition cursor-pointer" />
                    <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-5 opacity-30 grayscale hover:grayscale-0 transition cursor-pointer" />
                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxp51s24uz61687183761815.png" alt="VNPay" className="h-3 opacity-30 grayscale hover:grayscale-0 transition cursor-pointer" />
                </div>
            </div>
        </div>
    </div>
  </div>
</footer>
      </body>
    </html>
  );
}