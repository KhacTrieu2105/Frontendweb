"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StockinService from "../../../../../../services/StockinService";

export default function StockInDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await StockinService.getDetail(id);
      if (res.status) setData(res.data);
    })();
  }, [id]);

  if (!data) return <div>Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Chi tiết phiếu nhập #{data.id}
      </h1>

      <p><b>Nhà cung cấp:</b> {data.supplier_id}</p>
      <p><b>Ghi chú:</b> {data.note}</p>
      <p><b>Tổng tiền:</b> {Number(data.total_amount).toLocaleString()} đ</p>

      <table className="w-full border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sản phẩm</th>
            <th className="border p-2">Số lượng</th>
            <th className="border p-2">Giá nhập</th>
            <th className="border p-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">
                {item.product?.name}
              </td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">
                {Number(item.price).toLocaleString()} đ
              </td>
              <td className="border p-2">
                {(item.quantity * item.price).toLocaleString()} đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
