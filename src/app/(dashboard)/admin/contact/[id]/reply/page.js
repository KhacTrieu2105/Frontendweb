"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Send, MessageSquare, Loader2, 
  User, Mail, Info, Sparkles 
} from "lucide-react";
import ContactService from "../../../../../../../services/ContactService";
import Link from "next/link";

export default function ReplyContact() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  // Lấy thông tin khách hàng để hiển thị ngữ cảnh khi trả lời
  useEffect(() => {
    ContactService.getById(id).then((res) => {
      if (res.status) setContactInfo(res.data);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      await ContactService.reply(id, {
        reply_content: message,
      });

      // Thay thế alert bằng thông báo mượt mà hơn nếu bạn có Toast
      alert("Đã gửi phản hồi thành công!");
      router.push("/admin/contact");
    } catch (err) {
      alert("Gửi phản hồi thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* BREADCRUMB / BACK */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1E1E2D] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <MessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                PHẢN HỒI <span className="text-rose-500">LIÊN HỆ</span>
              </h1>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Ticket ID: #{id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT PHẢI: FORM SOẠN THẢO */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 text-rose-500 mb-2">
                   <Sparkles size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Nội dung phản hồi chính thức</span>
                </div>

                <div className="relative group">
                  <textarea
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[2rem] p-8 h-72 resize-none focus:bg-white focus:border-rose-500/20 outline-none transition-all font-medium text-gray-700 shadow-inner"
                    placeholder="Kính gửi khách hàng, cảm ơn bạn đã liên hệ với chúng tôi..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end items-center gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    disabled={loading || !message.trim()}
                    className="bg-[#1E1E2D] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-rose-600 transition-all shadow-xl shadow-gray-200 disabled:bg-gray-200 active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {loading ? "Đang gửi..." : "Gửi Email"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* CỘT TRÁI: NGỮ CẢNH (Context) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Info size={14} /> Đối tượng nhận tin
              </h3>
              
              {contactInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                      {contactInfo.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{contactInfo.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{contactInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Vấn đề của khách:</p>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-xs text-gray-600 italic leading-relaxed">
                        "{contactInfo.content}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex space-x-4">
                   <div className="rounded-full bg-gray-100 h-10 w-10"></div>
                   <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-gray-100 rounded"></div>
                   </div>
                </div>
              )}
            </div>

            <div className="bg-rose-500 rounded-[2rem] p-6 text-white shadow-lg shadow-rose-200">
                <h4 className="font-black text-xs uppercase tracking-widest mb-2">Mẹo phản hồi</h4>
                <p className="text-[11px] font-medium opacity-90 leading-loose">
                   Sử dụng ngôn ngữ lịch sự, chuyên nghiệp. Đảm bảo giải quyết đúng trọng tâm yêu cầu khách hàng để tăng trải nghiệm người dùng.
                </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}