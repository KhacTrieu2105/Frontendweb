// app/admin/category/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Edit, Trash2 } from 'lucide icons\react';
import { useParams } from 'next/navigation';

export default function CategoryDetail() {
  const [category, setCategory] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/category/${id}`)
      .then(res => res.json())
      .then(data => setCategory(data));
  }, [id]);

  if (!category) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/category" className="text-gray-600 hover:text-black">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">Chi tiết danh mục</h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/category/${id}/edit`} className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2">
            <Edit className="w-4 h-4" /> Sửa
          </Link>
          <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Xóa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div>
              <p className="text-sm text-gray-500">Tên danh mục</p>
              <p className="text-xl font-bold mt-1">{category.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Slug</p>
              <p className="font-mono bg-gray-100 px-3 py-1 rounded">{category.slug}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {category.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số sản phẩm</p>
              <p className="text-xl font-bold">24</p>
            </div>
          </div>

          {category.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-2">Mô tả</p>
              <p className="text-gray-700 leading-relaxed">{category.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}