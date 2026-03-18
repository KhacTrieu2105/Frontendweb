"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CreditCard, Wallet, Truck, CheckCircle2,
  ShoppingBag, Loader2, Landmark
} from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/NguyenKhacTrieu_backend/public/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/auth/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    const savedCart = localStorage.getItem(`cart_user_${parsedUser.id}`);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [router]);

  const subtotal = cart.reduce((sum, item) => sum + item.price_buy * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Kiểm tra giỏ hàng trước khi gửi
  if (!cart || cart.length === 0) {
    return alert("Giỏ hàng của bạn đang trống!");
  }

  setLoading(true);
  const formData = new FormData(e.currentTarget);

  // Chuẩn bị dữ liệu gửi lên Backend
  const orderData = {
    user_id: user.id,
    customer_name: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    payment_method: paymentMethod, // Lấy từ state (cod hoặc vnpay)
    total_amount: total,
    // Chuyển đổi cart từ frontend sang cart_items cho backend
    cart_items: cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price_buy
    }))
  };

  try {
    const res = await api.post("/orders", orderData);

    if (res.data.status) {
      // TRƯỜNG HỢP 1: THANH TOÁN VNPAY
      if (paymentMethod === "vnpay" && res.data.redirect_to_vnpay) {
        // Chuyển hướng trình duyệt đến cổng thanh toán VNPAY
        window.location.href = res.data.vnpay_url;
        return;
      }

      // TRƯỜNG HỢP 2: THANH TOÁN COD
      // Xóa giỏ hàng local sau khi đặt hàng thành công
      localStorage.removeItem(`cart_user_${user.id}`);
      setCart([]);
      
      // Thông báo cho các component khác (Navbar) cập nhật lại số lượng giỏ hàng
      window.dispatchEvent(new Event("cartUpdated"));
      
      setOrderSuccess(true);
      
      // Chuyển về trang chủ sau 5 giây
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  } catch (error) {
    console.error("Lỗi đặt hàng:", error);
    
    // Xử lý thông báo lỗi chi tiết
    const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi không xác định.";
    const validationErrors = error.response?.data?.errors;
    
    if (validationErrors) {
      console.table(validationErrors);
      alert("Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại các trường nhập liệu.");
    } else {
      alert("Lỗi: " + errorMsg);
    }
  } finally {
    setLoading(false);
  }
};

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="bg-green-50 p-10 rounded-[3rem] flex flex-col items-center shadow-sm border border-green-100">
            <CheckCircle2 size={100} className="text-green-500 mb-6 animate-in zoom-in duration-500" />
            <h1 className="text-3xl font-black text-green-900">Đặt hàng thành công!</h1>
            <p className="text-green-700 mt-2 font-medium text-center">Cảm ơn bạn. Đơn hàng đang được chuẩn bị.</p>
            <button onClick={() => router.push('/')} className="mt-8 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition">Quay lại trang chủ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20 font-sans">
      {/* Navbar Minimalist */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> QUAY LẠI
          </button>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center"><ShoppingBag size={18} className="text-white"/></div>
             <span className="font-black tracking-tighter text-xl">CHECKOUT</span>
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CỘT TRÁI: FORM */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Address */}
              <section className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-200">1</span>
                    <h2 className="text-2xl font-black text-gray-900">Thông tin giao hàng</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                    <input name="fullName" required defaultValue={user?.name || ""} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Điện thoại</label>
                    <input name="phone" required defaultValue={user?.phone || ""} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input name="email" type="email" required defaultValue={user?.email || ""} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ chi tiết</label>
                    <textarea name="address" required rows={3} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"></textarea>
                  </div>
                </div>
              </section>

              {/* Section 2: Payment */}
              <section className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-200">2</span>
                    <h2 className="text-2xl font-black text-gray-900">Phương thức thanh toán</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: "cod", icon: <Truck size={22} />, label: "Thanh toán khi nhận hàng", sub: "COD - Trả tiền cho shipper" },
                    { id: "vnpay", icon: <Landmark size={22} />, label: "Ví VNPAY / Ngân hàng", sub: "Thanh toán qua cổng VNPAY (QR, Thẻ ATM/Visa)", color: "text-blue-600" },
                    { id: "momo", icon: <Wallet size={22} />, label: "Ví MoMo", sub: "Thanh toán qua ứng dụng MoMo" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`relative flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === item.id ? "border-indigo-600 bg-indigo-50/50" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input type="radio" name="payment" value={item.id} checked={paymentMethod === item.id} onChange={() => setPaymentMethod(item.id)} className="w-5 h-5 accent-indigo-600" />
                      <div className={`${paymentMethod === item.id ? 'text-indigo-600' : 'text-gray-400'}`}>{item.icon}</div>
                      <div>
                        <p className="font-bold text-[15px]">{item.label}</p>
                        <p className="text-xs text-gray-500 font-medium">{item.sub}</p>
                      </div>
                      {item.id === 'vnpay' && (
                        <div className="absolute right-6 flex gap-1 italic font-black text-[10px] text-blue-700 opacity-50 uppercase tracking-tighter">VNPAY QR</div>
                      )}
                    </label>
                  ))}
                </div>
              </section>
            </form>
          </div>

          {/* CỘT PHẢI: SUMMARY */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-900/20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                    <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">Tóm tắt đơn hàng</h3>
                    
                    <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={item.thumbnail_url || `/storage/${item.thumbnail}`} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">{item.quantity}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-300 truncate w-32">{item.name}</span>
                                </div>
                                <span className="text-sm font-black italic">{(item.price_buy * item.quantity).toLocaleString()}₫</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-sm text-gray-400 font-medium italic">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString()}₫</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 font-medium italic">
                            <span>Giao hàng</span>
                            <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}₫`}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-lg font-black uppercase tracking-tighter">Tổng tiền</span>
                            <span className="text-3xl font-black text-indigo-400 tracking-tighter">
                                {total.toLocaleString()}₫
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading || cart.length === 0}
                        className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-lg mt-8 hover:bg-indigo-400 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-gray-700"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "XÁC NHẬN THANH TOÁN"}
                    </button>
                    
                    <div className="mt-6 flex justify-center gap-4 opacity-30 grayscale">
                        <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmbe0951686814406087.png" className="h-4" alt="vnpay" />
                        <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" className="h-4" alt="momo" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};