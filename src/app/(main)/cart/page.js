"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, ArrowLeft, Minus, Plus, Trash2, 
  ChevronRight, Truck, ShieldCheck, RefreshCcw 
} from "lucide-react";

// Custom hook quản lý giỏ hàng (giữ nguyên logic của bạn)
const useUserCart = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const loadCart = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      const savedCart = localStorage.getItem(`cart_user_${parsed.id}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setUser(null);
      setCart([]);
    }
  };

  useEffect(() => { loadCart(); }, []);

  useEffect(() => {
    const handleUpdate = () => loadCart();
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("cartUpdated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("cartUpdated", handleUpdate);
    };
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    if (user) {
      localStorage.setItem(`cart_user_${user.id}`, JSON.stringify(newCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    saveCart(newCart);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price_buy * item.quantity, 0);

  return { cart, cartCount, subtotal, user, updateQuantity, removeItem };
};

export default function CartPage() {
  const { cart, cartCount, subtotal, updateQuantity, removeItem, user } = useUserCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400">
             <ShoppingBag size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Chào bạn mới!</h2>
          <p className="text-gray-500 mb-8 font-medium">Vui lòng đăng nhập để xem những món đồ tuyệt vời trong giỏ hàng của bạn.</p>
          <Link href="/auth/login" className="block w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans">
      {/* Header Sync with Checkout */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-xs tracking-widest group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> QUAY LẠI CỬA HÀNG
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-gray-200">
                <ShoppingBag size={16} className="text-white"/>
             </div>
             <span className="font-black tracking-tighter text-xl uppercase">Giỏ hàng</span>
          </div>
          <div className="hidden sm:block text-[10px] font-black text-gray-400 tracking-widest italic uppercase">
            {user.name || user.username}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-10">
        {cart.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-24 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag size={64} className="text-gray-200" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 mb-10 font-medium">Có vẻ như bạn chưa chọn được món đồ ưng ý nào.</p>
            <Link href="/product" className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-95 shadow-xl">
              KHÁM PHÁ NGAY <ChevronRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: List Products */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tất cả sản phẩm ({cartCount})</h2>
              </div>
              
              {cart.map((item) => (
                <div key={item.id} className="group bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 flex flex-col sm:flex-row gap-6 hover:border-indigo-100 transition-all duration-300">
                  <div className="w-full sm:w-40 h-48 sm:h-40 bg-gray-50 rounded-[2rem] overflow-hidden relative shadow-inner">
                    <img
                      src={item.thumbnail_url || `/storage/${item.thumbnail}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Premium Edition</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-3 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-900 rounded-2xl p-1 shadow-lg shadow-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center text-white font-black text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Thành tiền</p>
                        <p className="text-2xl font-black text-indigo-600 tracking-tighter">
                          {(item.price_buy * item.quantity).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Summary Box (Sync with Checkout style) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
                  
                  <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4 flex items-center gap-2 uppercase tracking-tighter">
                    Tóm tắt đơn hàng
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm text-gray-400 font-medium italic">
                      <span>Tạm tính ({cartCount} món)</span>
                      <span>{subtotal.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 font-medium italic">
                      <span>Phí vận chuyển</span>
                      <span className="text-indigo-400">Miễn phí</span>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                      <span className="text-lg font-black uppercase tracking-tighter">Tổng cộng</span>
                      <span className="text-3xl font-black text-indigo-400 tracking-tighter">
                        {subtotal.toLocaleString()}₫
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full bg-white text-black text-center py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-400 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                  >
                    TIẾN HÀNH THANH TOÁN
                  </Link>

                  <div className="mt-8 grid grid-cols-3 gap-2">
                    {[
                      { icon: <Truck size={14} />, label: "Fast Ship" },
                      { icon: <ShieldCheck size={14} />, label: "Secure" },
                      { icon: <RefreshCcw size={14} />, label: "30 Days" }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 opacity-40">
                         <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">{item.icon}</div>
                         <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Giao hàng miễn phí cho mọi đơn hàng hôm nay
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}