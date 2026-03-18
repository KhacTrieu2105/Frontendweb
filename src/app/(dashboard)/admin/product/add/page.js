"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Image as ImageIcon, Tag } from "lucide-react";

import ProductService from "../../../../../../services/ProductService";
import CategoryService from "../../../../../../services/CategoryService";
import AttributeService from "../../../../../../services/AttributeService";

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [priceBuy, setPriceBuy] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({}); // {1: "đỏ", 2: "L", ...}

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const catRes = await CategoryService.getList();
      const catData = catRes.data?.data || catRes.data || [];
      setCategories(catData);

      const attrRes = await AttributeService.getList();
      let attrData = [];
      if (Array.isArray(attrRes.data)) {
        attrData = attrRes.data;
      } else if (Array.isArray(attrRes)) {
        attrData = attrRes;
      }
      setAttributes(attrData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Không thể tải dữ liệu danh mục và thuộc tính");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!name || !priceBuy || !categoryId) {
    setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price_buy", priceBuy);
    formData.append("category_id", categoryId);
    formData.append("description", description || "");
    formData.append("status", status);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const attributesArray = Object.entries(attributeValues)
      .filter(([_, value]) => value?.trim())
      .map(([attrId, value]) => ({
        attribute_id: parseInt(attrId),
        value: value.trim(),
      }));

    if (attributesArray.length > 0) {
      formData.append("attributes_json", JSON.stringify(attributesArray));
    }

    console.log("=== FORM DATA ĐƯỢC GỬI ĐI ===");
    for (let pair of formData.entries()) {
      console.log(pair[0], "=>", pair[1]);
    }



     const res = await ProductService.create(formData);
      if (res?.status === true) {
        alert("✅ Thêm sản phẩm thành công");
        router.push("/admin/product");
      } else {
        alert("❌ Thêm sản phẩm thất bại");
      }
    } catch (e) {
      console.error(e);
      alert("❌ Lỗi server");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Thêm sản phẩm mới</h1>
        <div className="flex gap-3">
          <Link href="/admin/product" className="px-4 py-2 rounded border bg-white hover:bg-gray-50">
            Hủy bỏ
          </Link>
          <button
            form="add-product"
            disabled={loading}
            className="px-5 py-2 rounded bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form id="add-product" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="font-semibold text-lg mb-4">Thông tin chung</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
              <textarea
                className="w-full border rounded-lg px-4 py-2 min-h-[90px] focus:ring-2 focus:ring-blue-500 outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Tag size={20} />
              Thuộc tính
            </h2>

            {attributes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Tag size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Chưa có thuộc tính nào</p>
                <p className="text-sm mt-1">Vui lòng thêm thuộc tính trong phần quản lý thuộc tính</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attributes.map((attr) => (
                  <div key={attr.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="bg-gray-50 border rounded-lg px-4 py-2 text-sm font-medium">
                      {attr.name}
                    </div>
                    <input
                      type="text"
                      className="md:col-span-2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={`Nhập ${attr.name.toLowerCase()}`}
                      value={attributeValues[attr.id] || ""}
                      onChange={(e) =>
                        setAttributeValues((prev) => ({
                          ...prev,
                          [attr.id]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <label className="block text-sm font-medium mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Chọn danh mục...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <label className="block text-sm font-medium mb-2">
              Giá bán <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={priceBuy}
              onChange={(e) => setPriceBuy(e.target.value)}
              placeholder="Nhập giá bán"
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <label className="block text-sm font-medium mb-3 text-left">Ảnh đại diện</label>
            <label className="block border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
              {preview ? (
                <img src={preview} className="mx-auto max-h-40 object-contain rounded" alt="Preview" />
              ) : (
                <div className="text-gray-400 py-4">
                  <ImageIcon className="mx-auto mb-2" size={32} />
                  <p>Tải ảnh lên</p>
                </div>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setThumbnail(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border flex justify-between items-center">
            <span className="font-medium">Trạng thái hiển thị</span>
            <input
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={status === 1}
              onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}