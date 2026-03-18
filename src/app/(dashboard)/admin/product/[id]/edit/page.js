"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft, Save, Package, AlertCircle, Image as ImageIcon,
  Tag, CheckCircle, Loader2, DollarSign, FileText, Hash, Layers
} from "lucide-react";

import CategoryService from "../../../../../../../services/CategoryService";
import AttributeService from "../../../../../../../services/AttributeService";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [thumbnail, setThumbnail] = useState(null); // File object để upload
  const [preview, setPreview] = useState(null);   // String URL để hiển thị

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = "http://localhost/NguyenKhacTrieu_backend/public/api";

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(`${API_BASE_URL}/products/${id}`, config);
        const productData = res.data?.data || res.data;

        if (productData) {
          setProduct(productData);
          
          // QUAN TRỌNG: Kiểm tra và gán URL ảnh cũ
          // Nếu backend trả về thumbnail_url (đường dẫn đầy đủ), dùng nó.
          // Nếu chỉ trả về tên file, ta nối với domain backend.
          if (productData.thumbnail_url) {
            setPreview(productData.thumbnail_url);
          } else if (productData.thumbnail) {
             setPreview(`http://localhost/NguyenKhacTrieu_backend/public/images/product/${productData.thumbnail}`);
          }

          if (productData.formatted_attributes) {
            const map = {};
            productData.formatted_attributes.forEach(attr => { 
              map[attr.attribute_id] = attr.value; 
            });
            setAttributeValues(map);
          }
        }

        const [catRes, attrRes] = await Promise.all([
          CategoryService.getList(),
          AttributeService.getList()
        ]);
        setCategories(catRes?.data || []);
        setAttributes(attrRes?.data || []);

      } catch (err) {
        setError("Không thể kết nối đến máy chủ.");
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("_method", "PUT"); // Method spoofing cho Laravel
      
      formData.append("name", product.name);
      formData.append("category_id", product.category_id);
      formData.append("price_buy", product.price_buy);
      formData.append("qty", product.qty || 0);
      formData.append("description", product.description || "");
      formData.append("content", product.content || "");
      formData.append("status", product.status);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const attributesArray = Object.entries(attributeValues)
        .filter(([_, value]) => value?.trim() !== "")
        .map(([attrId, value]) => ({ 
          attribute_id: parseInt(attrId), 
          value: value.trim() 
        }));
      formData.append("attributes_json", JSON.stringify(attributesArray));

      const response = await axios.post(`${API_BASE_URL}/products/${id}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data", 
          "Authorization": `Bearer ${token}` 
        }
      });

      if (response.data.status) {
        setSuccess(true);
        // Bắn event để trang danh sách tự làm mới (nếu đang mở tab khác)
        window.dispatchEvent(new CustomEvent("product-list-refresh", { detail: { source: "product-update" } }));
        setTimeout(() => router.push("/admin/product"), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi cập nhật dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-gray-400 font-medium animate-pulse">ĐANG TẢI DỮ LIỆU...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FE] pb-20 font-sans">
      {/* HEADER TỐI GIẢN */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/product" className="p-2.5 hover:bg-gray-100 rounded-xl transition-all group">
              <ArrowLeft size={20} className="text-gray-500 group-hover:text-black" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight">Cập nhật sản phẩm</h1>
              <div className="flex items-center gap-2 text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md mt-1 w-fit">
                <Hash size={12}/> ID: {id}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              form="main-form"
              disabled={loading}
              className="bg-[#1E1E2D] hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              LƯU THAY ĐỔI
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {success && (
          <div className="mb-6 bg-green-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-green-100 animate-in slide-in-from-top">
            <CheckCircle size={20} /> <span className="font-bold text-sm">Cập nhật thành công! Đang chuyển hướng...</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-2xl flex items-center gap-3">
            <AlertCircle size={20} /> <span className="font-semibold text-sm">{error}</span>
          </div>
        )}

        <form id="main-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI - CHI TIẾT */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FileText size={20}/></div>
                <h2 className="font-black text-gray-800 text-lg uppercase tracking-wider">Thông tin cơ bản</h2>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block ml-1">Tên sản phẩm</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-sm"
                    value={product.name || ""}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block ml-1">Slug hệ thống</label>
                    <input
                      disabled
                      className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-400 font-mono text-xs cursor-not-allowed"
                      value={product.slug || ""}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block ml-1">Danh mục</label>
                    <select
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-sm appearance-none"
                      value={product.category_id || ""}
                      onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block ml-1">Mô tả ngắn</label>
                  <textarea
                    rows={3}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-600 shadow-sm"
                    value={product.description || ""}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block ml-1">Nội dung chi tiết</label>
                  <textarea
                    rows={8}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-600 shadow-sm"
                    value={product.content || ""}
                    onChange={(e) => setProduct({ ...product, content: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Tag size={20}/></div>
                <h2 className="font-black text-gray-800 text-lg uppercase tracking-wider">Thuộc tính mở rộng</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attributes.map((attr) => (
                  <div key={attr.id}>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">{attr.name}</label>
                    <input
                      type="text"
                      placeholder={`Nhập ${attr.name.toLowerCase()}...`}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-orange-200 focus:bg-white outline-none transition-all text-sm font-bold"
                      value={attributeValues[attr.id] || ""}
                      onChange={(e) => setAttributeValues({ ...attributeValues, [attr.id]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - BỔ TRỢ */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Ảnh đại diện - Phần sửa chính */}
            <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-50 text-center">
              <label className="text-[11px] font-black text-gray-400 uppercase mb-4 block">Ảnh sản phẩm hiện tại</label>
              <div className="relative group w-full aspect-square rounded-[1.5rem] bg-gray-100 border-4 border-white shadow-inner flex flex-col items-center justify-center overflow-hidden transition-all hover:shadow-xl">
                {preview ? (
                  <>
                    <img 
                      src={preview} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt="Product"
                      onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Lỗi+Ảnh"; }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white p-4">
                      <ImageIcon className="mb-2" size={32} />
                      <p className="text-xs font-black uppercase tracking-widest">Thay đổi ảnh mới</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Chưa có ảnh</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setThumbnail(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-4 font-medium italic">* Hỗ trợ định dạng JPG, PNG, WebP</p>
            </div>

            {/* Tài chính & Kho */}
            <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-50 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-green-500" />
                <h3 className="font-black text-gray-800 text-sm uppercase">Kho & Giá</h3>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1 ml-1">Giá bán lẻ (VNĐ)</label>
                <div className="relative">
                   <input
                    type="number"
                    className="w-full pl-4 pr-12 py-4 bg-blue-50/50 rounded-2xl font-black text-blue-600 outline-none border-2 border-transparent focus:border-blue-200 text-lg shadow-inner"
                    value={product.price_buy || ""}
                    onChange={(e) => setProduct({ ...product, price_buy: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-blue-300">₫</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1 ml-1">Số lượng tồn (QTY)</label>
                <div className="relative">
                   <input
                    type="number"
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl font-black text-gray-700 outline-none border-2 border-transparent focus:border-gray-200 shadow-inner"
                    value={product.qty || 0}
                    onChange={(e) => setProduct({ ...product, qty: e.target.value })}
                  />
                  <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                </div>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-50">
               <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 ml-1">Chế độ hiển thị</label>
               <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProduct({...product, status: 1})}
                    className={`py-3 rounded-xl font-black text-[11px] uppercase transition-all ${product.status == 1 ? "bg-green-500 text-white shadow-lg shadow-green-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                  >
                    Hoạt động
                  </button>
                  <button
                    type="button"
                    onClick={() => setProduct({...product, status: 0})}
                    className={`py-3 rounded-xl font-black text-[11px] uppercase transition-all ${product.status == 0 ? "bg-red-500 text-white shadow-lg shadow-red-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                  >
                    Tạm ẩn
                  </button>
               </div>
            </div>

            {/* Thông tin thêm */}
            <div className="p-6 bg-[#1E1E2D] rounded-[2rem] text-white/90">
               <div className="flex items-center gap-2 mb-4">
                  <Layers size={16} className="text-rose-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Lịch sử hệ thống</p>
               </div>
               <div className="space-y-3 text-[11px]">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40 font-bold uppercase">Khởi tạo</span>
                    <span className="font-mono">{new Date(product.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40 font-bold uppercase">Cập nhật</span>
                    <span className="font-mono">{new Date(product.updated_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 font-bold uppercase">Bởi</span>
                    <span className="font-bold text-rose-400">ADMIN_TR_01</span>
                  </div>
               </div>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
}