"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderService from "../../../../../../../services/OrderService";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  CheckCircle, 
  Clock, 
  Printer
} from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    const res = await OrderService.getById(id);
    if (res.status === true) setOrder(res.data);
    setLoading(false);
  };

  const changeStatus = async (status) => {
    try {
      await OrderService.updateStatus(id, status);
      alert("Cập nhật trạng thái thành công");
      fetchOrderDetail(); // Refresh lại dữ liệu tại chỗ thay vì đẩy ra ngoài
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-gray-500 font-medium">Đang tải thông tin đơn hàng...</p>
    </div>
  );

  if (!order) return <p className="p-6 text-center">Không tìm thấy đơn hàng</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans bg-gray-50 min-h-screen">
      {/* Nút quay lại & Action chính */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Quay lại danh sách</span>
        </button>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium transition shadow-sm">
            <Printer size={16} />
            In hóa đơn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM & TRẠNG THÁI */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trạng thái đơn hàng */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Mã đơn hàng</p>
              <h1 className="text-2xl font-black text-gray-900">#{order.id}</h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Trạng thái hiện tại</p>
              {order.status === 1 ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-bold border border-amber-200">
                  <Clock size={14} /> Đang xử lý
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200">
                  <CheckCircle size={14} /> Hoàn thành
                </span>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm (Chi tiết đơn hàng) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <Package className="text-indigo-600" size={20} />
              <h2 className="font-bold text-gray-800">Sản phẩm trong đơn</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4 text-left">Sản phẩm</th>
                    <th className="p-4 text-center">Số lượng</th>
                    <th className="p-4 text-right">Giá</th>
                    <th className="p-4 text-right">Tổng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* Map dữ liệu sản phẩm ở đây nếu Backend có trả về order_details */}
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="p-4 font-medium text-gray-800">{item.product_name || `Sản phẩm #${item.product_id}`}</td>
                      <td className="p-4 text-center">{item.quantity}</td>
                      <td className="p-4 text-right">{item.price?.toLocaleString()}₫</td>
                      <td className="p-4 text-right font-bold text-indigo-600">
                        {(item.quantity * item.price).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 flex flex-col items-end space-y-2">
               <div className="flex justify-between w-48 text-sm">
                  <span className="text-gray-500">Tạm tính:</span>
                  <span className="font-semibold">{order.total_amount?.toLocaleString()}₫</span>
               </div>
               <div className="flex justify-between w-48 text-lg">
                  <span className="font-bold text-gray-800">Tổng cộng:</span>
                  <span className="font-black text-rose-600">{order.total_amount?.toLocaleString()}₫</span>
               </div>
            </div>
          </div>

          {/* Nút cập nhật trạng thái */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Thay đổi trạng thái đơn hàng</h3>
            <div className="flex gap-3">
              <button
                onClick={() => changeStatus(1)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${order.status === 1 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-100'}`}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => changeStatus(2)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${order.status === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-100'}`}
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN KHÁCH HÀNG */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User size={18} className="text-indigo-600" />
              Thông tin khách hàng
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><User size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Họ và tên</p>
                  <p className="text-sm font-semibold">{order.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Phone size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Số điện thoại</p>
                  <p className="text-sm font-semibold">{order.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Mail size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Email</p>
                  <p className="text-sm font-semibold text-blue-600 underline">{order.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><MapPin size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Địa chỉ nhận hàng</p>
                  <p className="text-sm font-medium leading-relaxed">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <h3 className="font-bold mb-2 flex items-center gap-2"> Ghi chú nội bộ </h3>
            <textarea 
              className="w-full bg-indigo-800/50 border border-indigo-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-indigo-300"
              rows={4}
              placeholder="Thêm ghi chú về đơn hàng này..."
            ></textarea>
            <button className="w-full mt-3 bg-white text-indigo-900 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
              Lưu ghi chú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}