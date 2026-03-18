'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Package, Users, ShoppingCart, BarChart3, LogOut, Menu, 
  Settings, Layers, Home, Bell, FileText, Tag, Layout, 
  Image as ImageIcon, MessageSquare, Percent, Warehouse, Search, ChevronRight, User as UserIcon
} from 'lucide-react';
import AuthService from '../../../../services/AuthService';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const token = localStorage.getItem('token'); // Sử dụng key chung

    if (!token || user?.roles !== 'admin') {
      router.push('/auth/login');
    } else {
      setAdminUser(user);
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?")) {
      AuthService.logout();
    }
  };

  const menuGroups = [
    {
      group: "Hệ thống",
      items: [
        { label: "Dashboard", href: "/admin", icon: BarChart3 },
        { label: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart, badge: "5" },
      ]
    },
    {
      group: "Quản lý sản phẩm",
      items: [
        { label: "Sản phẩm", href: "/admin/product", icon: Package },
        { label: "Danh mục", href: "/admin/caterogy/list", icon: Layers },
        { label: "Thuộc tính", href: "/admin/attribute", icon: Tag },
        { label: "Nhập kho", href: "/admin/stock-in", icon: Warehouse },
        { label: "Khuyến mãi", href: "/admin/promotion", icon: Percent },
      ]
    },
    {
      group: "Nội dung & Giao diện",
      items: [
        { label: "Bài viết", href: "/admin/post", icon: FileText },
        { label: "Banner", href: "/admin/banner", icon: ImageIcon },
        { label: "Menu", href: "/admin/menu", icon: Layout },
        { label: "Liên hệ", href: "/admin/contact", icon: MessageSquare },
        { label: "Chủ đề", href: "/admin/topic", icon: Layout },
      ]
    },
    {
      group: "Tài khoản",
      items: [
        { label: "Thành viên", href: "/admin/user", icon: Users },
        { label: "Cài đặt", href: "/admin/settings", icon: Settings },
      ]
    }
  ];

  if (!adminUser) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FC]">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">Đang xác thực quyền quản trị...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      <aside className={`${sidebarOpen ? "w-72" : "w-24"} bg-[#1E1E2D] text-white transition-all duration-300 fixed inset-y-0 left-0 z-50 flex flex-col shadow-2xl`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <div className={`flex items-center gap-3 transition-all ${sidebarOpen ? "opacity-100" : "opacity-0 invisible w-0"}`}>
            <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center shrink-0">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg whitespace-nowrap">LUXURY ADMIN</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400">
            {sidebarOpen ? <ChevronRight className="w-5 h-5 rotate-180" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {sidebarOpen && <p className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">{group.group}</p>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.label} href={item.href} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'}`}>
                      <div className="flex items-center gap-4">
                        <Icon className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span className="text-[14px] font-medium whitespace-nowrap">{item.label}</span>}
                      </div>
                      {sidebarOpen && item.badge && <span className="bg-rose-600/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-xl w-full transition-all group">
            <LogOut className="w-5 h-5 shrink-0 group-hover:translate-x-1" />
            {sidebarOpen && <span className="text-sm font-semibold">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? "ml-72" : "ml-24"} transition-all duration-300 min-h-screen flex flex-col`}>
        <header className={`sticky top-0 z-40 transition-all px-8 h-20 flex items-center justify-between ${isScrolled ? "bg-white/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent"}`}>
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl w-72 border focus-within:bg-white transition-all shadow-inner">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full outline-none" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 uppercase">{adminUser?.name}</p>
              <p className="text-[11px] text-gray-500 font-medium italic">Quyền: {adminUser?.roles}</p>
            </div>
            <div className="w-11 h-11 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-md">
              <UserIcon className="w-6 h-6" />
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {pathname === '/admin' ? 'Tổng quan hệ thống' : pathname.split('/').pop().replace(/-/g, ' ')}
              </h2>
            </div>
            <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-xl text-sm font-bold text-gray-700 hover:shadow-md transition-all">
              <Home className="w-4 h-4" /> Xem Website
            </Link>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{children}</div>
        </div>

        <footer className="px-8 py-6 text-center text-gray-400 text-[10px] font-bold uppercase border-t bg-white/50">
          © 2026 LUXURY SHOP • HỆ THỐNG QUẢN TRỊ NỘI BỘ
        </footer>
      </main>
    </div>
  );
}