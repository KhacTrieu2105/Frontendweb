'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, User, Menu, X, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ContactService from '../../../../services/ContactService';

// Schema validation bằng Zod
const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^0[0-9]{9}$/, 'Số điện thoại phải là 10 số, bắt đầu bằng 0'),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
});

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success, error

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  // Hàm xử lý gửi Form
  // File: page.js (Contact người dùng)
const onSubmit = async (data) => {
  try {
    const contactData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      content: data.message, // Map 'message' từ form vào 'content' của DB
      // KHÔNG gửi trường 'title' vì DB không có cột này
      status: 1
    };

    const res = await ContactService.create(contactData);
    
    if (res.data.status === true) {
      alert("Gửi liên hệ thành công!");
      reset();
    }
  } catch (error) {
    console.error("Lỗi chi tiết:", error.response?.data);
    alert("Không thể gửi: " + (error.response?.data?.message || "Lỗi Server"));
  }
};

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
   

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* THÔNG TIN LIÊN HỆ */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-600">Chúng tôi luôn lắng nghe ý kiến của bạn.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full"><MapPin size={20}/></div>
                <div>
                  <p className="font-bold">Địa chỉ</p>
                  <p className="text-gray-600">208/7/4 Võ Văn Hát, Quận 9, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full"><Phone size={20}/></div>
                <div>
                  <p className="font-bold">Điện thoại</p>
                  <p className="text-gray-600">+84 946 035 326</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full"><Mail size={20}/></div>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-gray-600">support@bagshop.com</p>
                </div>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden border">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.520124831637!2d106.7845603!3d10.8479868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752713184d0885%3A0x6a6d6d849a0a0e9!2zVsO1IFbEg24gSMOhdCwgTG9uZyBUcsaw4budbmcsIFF14bqtbiA5LCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000"
                    width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy">
                </iframe>
            </div>
          </div>

          {/* FORM LIÊN HỆ */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Gửi tin nhắn cho chúng tôi</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên *</label>
                <input
                  {...register('name')}
                  className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'focus:ring-black'}`}
                  placeholder="Nhập họ tên"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    {...register('email')}
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'focus:ring-black'}`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                  <input
                    {...register('phone')}
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'focus:ring-black'}`}
                    placeholder="09xxx"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tin nhắn *</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${errors.message ? 'border-red-500 focus:ring-red-200' : 'focus:ring-black'}`}
                  placeholder="Bạn cần hỗ trợ gì?"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'ĐANG GỬI...' : 'GỬI LIÊN HỆ'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
     
    </div>
  );
}