'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ChevronLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthService from '../../../../services/AuthService'; 

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const user = AuthService.getCurrentUser();
    if (user?.roles === 'admin') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier').trim();
    const password = formData.get('password');

    try {
      const res = await AuthService.login({ identifier, password });

      if (res.status) {
        // Lưu thông tin vào LocalStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        setSuccess(true);
        window.dispatchEvent(new Event("storage"));

        // Chuyển hướng theo quyền sau 1 giây thành công
        setTimeout(() => {
          if (res.user.roles === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Nút quay lại trang chủ */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black transition-all group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold tracking-tight uppercase">Trang chủ</span>
      </Link>

      <div className="w-full max-w-[1000px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* CỘT TRÁI: BANNER DESIGN */}
        <div className="hidden md:flex md:w-1/2 bg-[#1E1E2D] p-12 flex-col justify-between relative overflow-hidden">
          {/* Decor background circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-rose-500 rounded-xl mb-6 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Lock className="text-white" size={24} />
            </div>
            <h1 className="text-white text-4xl font-black leading-tight tracking-tighter">
              LUXURY <br /> <span className="text-rose-500">CONTROL CENTER</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg font-medium">Hệ thống quản trị nội bộ dành cho nhân viên và đối tác.</p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-8">
             <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">© 2024 Premium System</p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center bg-white">
          <div className="w-full max-w-[340px] mx-auto">
            <header className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Đăng nhập</h2>
                <p className="text-gray-500 font-medium">Vui lòng nhập thông tin để tiếp tục</p>
            </header>

            {/* Thông báo lỗi/thành công */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 text-[11px] font-black uppercase tracking-wider flex items-center gap-3 rounded-lg">
                    <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">!</span>
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 text-[11px] font-black uppercase tracking-wider flex items-center gap-3 rounded-lg">
                    <Loader2 className="animate-spin" size={14} />
                    Xác thực thành công...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Tài khoản / Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    name="identifier" 
                    type="text" 
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/10 outline-none transition-all text-sm font-semibold" 
                    placeholder="Username hoặc Email" 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Mật khẩu</label>
                    <Link href="#" className="text-[10px] font-bold text-rose-500 hover:underline">Quên mật khẩu?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-500/10 outline-none transition-all text-sm font-semibold" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button 
                disabled={loading} 
                className="w-full bg-[#1E1E2D] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all disabled:bg-gray-400 shadow-xl shadow-gray-200 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Xác nhận đăng nhập <ArrowRight size={18} /></>}
              </button>

              {/* REGISTER LINK SECTION */}
              <div className="pt-6 border-t border-gray-100 mt-6">
                <p className="text-center text-sm text-gray-500 font-medium">
                  Bạn chưa có tài khoản?
                </p>
                <Link 
                  href="/auth/register" 
                  className="mt-3 w-full border-2 border-gray-100 text-gray-900 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-200 transition-all"
                >
                  <UserPlus size={16} /> Tạo tài khoản mới
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}