'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  AlertCircle,
  Image as ImageIcon,
  Save,
} from 'lucide-react';

import CategoryService from '../../../../../../../services/CategoryService';

export default function EditCategory() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.match(/\/(\d+)\//)?.[1];

  // ================= STATE =================
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState(0);
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ================= LOAD CATEGORY LIST =================
  useEffect(() => {
    CategoryService.getList().then((res) => {
      const list = res.data?.data ?? res.data;
      if (Array.isArray(list)) setCategories(list);
    });
  }, []);

  // ================= LOAD CATEGORY DETAIL =================
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const res = await CategoryService.getById(id);
        const data = res.data?.data ?? res.data;

        setName(data.name ?? '');
        setSlug(data.slug ?? '');
        setDescription(data.description ?? '');
        setParentId(Number(data.parent_id) || 0);
        setSortOrder(Number(data.sort_order) || 1);
        setStatus(Number(data.status) || 1);
        setImage(data.image ?? '');
      } catch {
        setError('Không tải được dữ liệu danh mục');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ================= SLUG AUTO =================
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

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSaving(true);

  try {
    const payload = {
      name: name.trim(),
      slug: slug.trim(),        // ❗ slug giữ nguyên nếu không sửa
      image: image?.trim() || null,
      parent_id: Number(parentId),
      sort_order: Number(sortOrder),
      description: description ?? '',
      status: Number(status),
    };

    await CategoryService.update(id, payload);
    router.push('/admin/caterogy/list');
  } catch (err) {
    setError(
      err.response?.data?.message ||
      JSON.stringify(err.response?.data?.errors)
    );
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* BACK */}
      <Link
        href="/admin/caterogy/list"
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft /> Quay lại danh sách
      </Link>

      {/* TITLE */}
      <h1 className="text-3xl font-extrabold flex items-center gap-3 mb-6">
        <Package className="text-blue-600" /> Chỉnh sửa danh mục
      </h1>

      <div className="bg-white rounded-2xl shadow border p-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex gap-2 rounded-lg">
            <AlertCircle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="font-semibold">Tên danh mục</label>
            <input
              value={name}
              onChange={handleNameChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="font-semibold">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="font-semibold flex items-center gap-2">
              <ImageIcon size={18} /> Tên file ảnh
            </label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="vd: anh-tui-xach-hermes.jpg"
              className="w-full p-3 border rounded-lg"
            />

            {image && (
              <img
                src={`/image/${image}`}
                className="w-32 h-32 object-cover rounded-lg border mt-3"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </div>

          {/* PARENT */}
          <div>
            <label className="font-semibold">Danh mục cha</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(Number(e.target.value))}
              className="w-full p-3 border rounded-lg"
            >
              <option value={0}>-- Không có --</option>
              {categories
                .filter((c) => c.id != id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* SORT */}
          <div>
            <label className="font-semibold">Thứ tự sắp xếp</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="font-semibold">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full p-3 border rounded-lg"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-semibold">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? 'Đang lưu...' : 'Cập nhật danh mục'}
          </button>
        </form>
      </div>
    </div>
  );
}
