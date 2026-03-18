'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Mail, Phone, User, MessageSquare, 
  Calendar, Reply, Trash2, ShieldCheck 
} from "lucide-react";
import ContactService from "../../../../../../../services/ContactService";

export default function ContactShow() {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await ContactService.getById(id);
      if (res.status) {
        setContact(res.data);
      }
    } catch (err) {
      console.error("Lỗi lấy chi tiết:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-bold">Không tìm thấy thông tin liên hệ này.</p>
        <Link href="/admin/contact" className="text-rose-500 underline mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      {/* Nút quay lại nhanh */}
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-all font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          
          {/* HEADER TRANG CHI TIẾT */}
          <div className="bg-[#1E1E2D] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-3xl font-black text-rose-500 border border-white/10">
                  {contact.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{contact.name}</h1>
                  <div className="flex items-center gap-3 mt-2 text-gray-400">
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                      <ShieldCheck size={14} className="text-emerald-400" /> ID: #{contact.id}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                      <Calendar size={14} /> {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  href={`/admin/contact/${contact.id}/reply`}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-rose-500/20"
                >
                  <Reply size={18} /> Phản hồi ngay
                </Link>
              </div>
            </div>
          </div>

          {/* NỘI DUNG CHI TIẾT */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Thông tin khách hàng</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Địa chỉ Email</p>
                        <p className="text-sm font-bold text-gray-900">{contact.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Số điện thoại</p>
                        <p className="text-sm font-bold text-gray-900">{contact.phone || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI: NỘI DUNG TIN NHẮN */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Nội dung yêu cầu</h3>
                  <div className="relative p-6 bg-rose-50/30 rounded-[2rem] border border-rose-100/50 min-h-[150px]">
                    <MessageSquare className="absolute top-6 right-6 text-rose-200" size={40} />
                    <p className="text-gray-700 leading-relaxed font-medium italic relative z-10">
                      "{contact.content}"
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* FOOTER ACTION */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-400 font-medium italic">
                Lưu ý: Luôn kiểm tra tính xác thực của email trước khi phản hồi khách hàng.
              </p>
              <button 
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest transition-all"
                onClick={() => {
                   if(confirm("Xóa liên hệ này?")) {
                      // Logic xóa
                   }
                }}
              >
                <Trash2 size={16} /> Xóa yêu cầu này
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}