"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  PackagePlus, 
  Info, 
  Store,
  FileText,
  Calculator
} from "lucide-react";
import StockinService from "../../../../../../services/StockinService";
import ProductService from "../../../../../../services/ProductService";

export default function AddStockInPage() {
  const router = useRouter();

  // ===== BASIC INFO =====
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");

  // ===== PRODUCTS =====
  const [productOptions, setProductOptions] = useState([]);
  const [products, setProducts] = useState([
    { product_id: "", quantity: 1, price: 0 },
  ]);

  // Fetch Products
  useEffect(() => {
    (async () => {
      const res = await ProductService.getList(1, 1000, "");
      if (res?.status) {
        setProductOptions(res.data);
      }
    })();
  }, []);

  // Tính tổng tiền phiếu nhập bằng useMemo để tối ưu hiệu năng
  const grandTotal = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  }, [products]);

  // ================== HANDLERS ==================
  const handleAddProduct = () => {
    setProducts([...products, { product_id: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleChangeProduct = (index, field, value) => {
    const newProducts = [...products];
    if (field === "product_id") {
      const selected = productOptions.find((p) => p.id == value);
      newProducts[index] = {
        ...newProducts[index],
        product_id: value,
        price: selected ? selected.price_buy : 0,
      };
    } else {
      newProducts[index][field] = Number(value);
    }
    setProducts(newProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (products.length === 0) return alert("Phải có ít nhất 1 sản phẩm");
    
    const payload = {
      supplier_id: supplier ? Number(supplier) : null,
      note: note || "",
      products: products.map((p) => ({
        product_id: Number(p.product_id),
        quantity: Number(p.quantity),
        price: Number(p.price),
      })),
    };

    try {
      await StockinService.create(payload);
      alert("Nhập kho thành công");
      router.push("/admin/stock-in");
    } catch (error) {
      alert("Lỗi nhập kho");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <PackagePlus className="text-blue-600" />
              TẠO PHIẾU NHẬP KHO
            </h1>
            <p className="text-sm text-gray-500">Thêm sản phẩm mới vào kho hàng hệ thống</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Save size={20} />
          LƯU PHIẾU NHẬP
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: FORM INFO */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2 font-bold text-gray-700">
              <FileText size={18} className="text-blue-500" />
              Chi tiết các mặt hàng
            </div>
            
            <div className="p-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 mb-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Đơn giá nhập</div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-3">
                {products.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all"
                  >
                    {/* PRODUCT SELECT */}
                    <div className="col-span-6">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleChangeProduct(index, "product_id", e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                      >
                        <option value="">Chọn sản phẩm...</option>
                        {productOptions.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* QUANTITY */}
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleChangeProduct(index, "quantity", e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm text-center outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* PRICE */}
                    <div className="col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleChangeProduct(index, "price", e.target.value)}
                          className="w-full bg-white border border-gray-200 pl-3 pr-8 py-2.5 rounded-lg text-sm text-right font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold italic">₫</span>
                      </div>
                    </div>

                    {/* DELETE */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        disabled={products.length === 1}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddProduct}
                className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-sm border-2 border-dashed border-blue-100 w-full justify-center py-4 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all"
              >
                <Plus size={20} />
                Thêm mặt hàng mới
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY & INFO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Supplier & Note */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Store size={18} className="text-blue-500" />
              Thông tin nguồn hàng
            </h2>
            
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Nhà cung cấp</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                placeholder="ID hoặc Tên nhà cung cấp"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Ghi chú phiếu nhập</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                rows={4}
                placeholder="Lý do nhập kho, số chứng từ..."
              />
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
             <Calculator className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
             <h2 className="font-bold text-blue-200 mb-4 flex items-center gap-2">
               <Info size={18} />
               TỔNG KẾT PHIẾU
             </h2>
             
             <div className="space-y-3 relative z-10">
               <div className="flex justify-between text-sm">
                 <span className="opacity-70">Tổng số mặt hàng:</span>
                 <span className="font-bold">{products.length} dòng</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="opacity-70">Tổng số lượng SP:</span>
                 <span className="font-bold">
                   {products.reduce((sum, p) => sum + p.quantity, 0)} cái
                 </span>
               </div>
               <div className="pt-4 mt-4 border-t border-white/20">
                 <p className="text-xs opacity-70 mb-1">Tổng tiền cần thanh toán:</p>
                 <p className="text-3xl font-black">{grandTotal.toLocaleString('vi-VN')}₫</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}