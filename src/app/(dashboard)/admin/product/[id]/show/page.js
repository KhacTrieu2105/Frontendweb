// app/admin/product/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Edit, Trash2 } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();

  // Demo data
  const product = {
    id,
    name: "Áo thun cotton oversize",
    sku: "AT001",
    price: 350000,
    salePrice: 299000,
    stock: 120,
    category: "Áo thun",
    status: "active",
    description: "Chất liệu cotton 100%, thoáng mát, form rộng thoải mái...",
    images: ["1", "2", "3"]
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/product" className="text-gray-600 hover:text-black">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">Chi tiết sản phẩm</h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/product/${id}/edit`} className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2">
            <Edit className="w-4 h-4" /> Sửa
          </Link>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-8">
            <h2 className="text-2xl font-bold mb-6">{product.name}</h2>
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <p className="text-gray-500">Mã SKU</p>
                <p className="font-mono bg-gray-100 px-3 py-1 rounded inline-block">{product.sku}</p>
              </div>
              <div>
                <p className="text-gray-500">Danh mục</p>
                <p className="font-semibold">{product.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Giá gốc</p>
                <p className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} ₫</p>
              </div>
              <div>
                <p className="text-gray-500">Giá khuyến mãi</p>
                <p className="text-2xl font-bold text-rose-600">{product.salePrice.toLocaleString()} ₫</p>
              </div>
              <div>
                <p className="text-gray-500">Tồn kho</p>
                <p className="text-2xl font-bold text-green-600">{product.stock}</p>
              </div>
              <div>
                <p className="text-gray-500">Trạng thái</p>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">Đang bán</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-8">
            <h3 className="text-xl font-bold mb-4">Mô tả sản phẩm</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-bold mb-4">Hình ảnh ({product.images.length})</h3>
            <div className="space-y-3">
              {product.images.map((_, i) => (
                <div key={i} className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}