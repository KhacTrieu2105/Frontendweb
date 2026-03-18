'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CategoryService from '../../../../../../services/CategoryService';

export default function AddCategory() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState(''); // 👉 chỉ là TÊN FILE
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState(0);
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState('1');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Tạo slug tự động
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(generateSlug(value));
  };

  // 🔹 Load danh mục cha
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await CategoryService.getList();
      if (res.status === true) {
        const list = res.data?.data || res.data || [];
        setCategories(list);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        name,
        slug,
        image: image || null, // 👉 tên file ảnh
        parent_id: parentId,
        sort_order: sortOrder,
        description,
        status,
      };

      await CategoryService.create(data);
      router.push('/admin/caterogy/list');
    } catch (err) {
      setError('Không thể tạo danh mục. Vui lòng kiểm tra dữ liệu!');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back */}
      <Link
        href="/admin/caterogy/list"
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft size={20} /> Quay lại
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Package className="text-rose-600" /> Thêm danh mục mới
      </h1>

      <div className="bg-white p-8 rounded-xl shadow mt-6">
        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 flex items-center gap-2 mb-4">
            <AlertCircle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="font-medium">Tên danh mục *</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              required
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="font-medium">Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border rounded bg-gray-100"
            />
          </div>

          {/* Image name */}
          <div>
            <label className="font-medium flex items-center gap-2">
              <ImageIcon size={18} /> Tên file ảnh
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="vd: anh-tui-xach-hermes.jpg"
              className="w-full p-3 border rounded"
            />

            {/* Preview */}
            {image && (
              <img
                src={`/image/${image}`}
                alt="preview"
                className="w-24 h-24 mt-3 rounded-lg object-cover border"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </div>

          {/* Parent */}
          <div>
            <label className="font-medium">Danh mục cha</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(Number(e.target.value))}
              className="w-full p-3 border rounded"
            >
              <option value={0}>Không có</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order */}
          <div>
            <label className="font-medium">Thứ tự</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Mô tả</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Status */}
          <div>
            <label className="font-medium">Trạng thái</label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="1"
                  checked={status === '1'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Hoạt động
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="0"
                  checked={status === '0'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Tạm ẩn
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            {loading ? 'Đang lưu...' : 'Lưu danh mục'}
          </button>
        </form>
      </div>
    </div>
  );
}
