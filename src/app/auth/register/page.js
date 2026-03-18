'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail, Lock, Eye, EyeOff, Loader2,
  ArrowRight, User as UserIcon, ChevronLeft,
  Sparkles, CheckCircle2, Phone
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import httpaxios from '../../../../services/httpaxios';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName')?.trim();
    const email = formData.get('identifier')?.trim();
    const phone = formData.get('phone')?.trim();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validate email must be @gmail.com
    if (!email.endsWith('@gmail.com')) {
      setError('Email phải có định dạng @gmail.com');
      setLoading(false);
      return;
    }

    // Validate phone number: exactly 10 digits, no letters
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Số điện thoại phải có đúng 10 chữ số và không chứa chữ cái');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      await httpaxios.post('/register', {
        name: fullName,
        email: email,
        phone: phone,
        password: password,
        password_confirmation: confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0][0]
        : 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black transition-all group z-20"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Trang chủ</span>
      </Link>

      <div className="w-full max-w-[1100px] bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* ================= LEFT SIDE: BRAND EXPERIENCE ================= */}
        <div className="hidden md:flex md:w-5/12 bg-black p-12 flex-col justify-between relative overflow-hidden">
          {/* Abstract Decorations */}
          <div className="absolute top-[-15%] right-[-15%] w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 tracking-widest uppercase">
              <Sparkles size={14} className="text-yellow-400" /> Member Benefits
            </div>
            <h1 className="text-white text-4xl font-black leading-tight">
              GIA NHẬP <br /> 
              <span className="text-indigo-400">CỘNG ĐỒNG</span>
            </h1>
            <ul className="mt-8 space-y-4">
              {[
                'Tích lũy điểm thưởng mỗi đơn hàng',
                'Nhận thông báo bộ sưu tập độc quyền',
                'Ưu đãi 10% cho đơn hàng đầu tiên',
                'Quản lý lịch sử mua hàng dễ dàng'
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-indigo-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
            <p className="text-white/80 text-sm leading-relaxed">
              Trở thành một phần của Modern Store để định hình phong cách thời trang của riêng bạn.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: REGISTER FORM ================= */}
        <div className="w-full md:w-7/12 p-8 md:p-16 lg:p-20 bg-white">
          <div className="max-w-[400px] mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Đăng ký ngay</h2>
              <p className="text-gray-500 mt-2 font-medium">Bắt đầu hành trình mua sắm tuyệt vời của bạn.</p>
            </div>

            {/* Error/Success Feedback */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm font-medium">
                Đăng ký thành công! Đang chuyển hướng đến đăng nhập...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Họ và tên</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    name="fullName"
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Số điện thoại</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="0123456789"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    onInput={(e) => {
                      // Only allow numbers
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium placeholder:text-gray-300"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">Số điện thoại phải có đúng 10 chữ số</p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Địa chỉ Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    name="identifier"
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium placeholder:text-gray-300"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">Email phải có định dạng @gmail.com</p>
              </div>

              {/* Password Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Mật khẩu</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Xác nhận</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 group hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Tạo tài khoản
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-gray-500 text-sm font-medium">
              Đã là thành viên?{' '}
              <Link href="/auth/login" className="text-black font-black hover:underline underline-offset-4 decoration-2">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
