"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import promotionService from "../../../../../../services/promotionService";
import productService from "../../../../../../services/ProductService";
import { 
  Plus, Trash2, Calendar, AlertCircle, 
  Search, X 
} from "lucide-react";

export default function AddPromotionPage() {
  const router = useRouter();

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [promotionType, setPromotionType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchInModal, setSearchInModal] = useState("");

  // Load sản phẩm
  useEffect(() => {
    productService.getList().then((res) => {
      if (res.status === true) {
        const list = res.data?.data || res.data || [];
        setAllProducts(list);
      }
    });
  }, []);

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchInModal.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchInModal.toLowerCase())
  );

  const addProductToPromotion = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      alert("Sản phẩm này đã được thêm!");
      return;
    }

    if (!discountValue || discountValue <= 0) {
      alert("Vui lòng nhập giá trị giảm giá trước!");
      return;
    }

    const discountedPrice = promotionType === "percent"
      ? product.price_buy * (1 - discountValue / 100)
      : product.price_buy - discountValue;

    const newItem = {
      ...product,
      original_price: product.price_buy,
      sale_price: Math.max(0, Math.round(discountedPrice)),
      discount_percent: promotionType === "percent" 
        ? discountValue 
        : Math.round(((product.price_buy - discountedPrice) / product.price_buy) * 100),
    };

    setSelectedProducts([...selectedProducts, newItem]);
    setShowProductModal(false);
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const applyToAll = () => {
    if (!discountValue || discountValue <= 0) {
      alert("Vui lòng nhập giá trị giảm giá");
      return;
    }

    const discounted = allProducts.map((p) => {
      const salePrice = promotionType === "percent"
        ? Math.round(p.price_buy * (1 - discountValue / 100))
        : Math.max(0, p.price_buy - discountValue);

      return {
        ...p,
        original_price: p.price_buy,
        sale_price: salePrice,
        discount_percent: promotionType === "percent"
          ? discountValue
          : Math.round(((p.price_buy - salePrice) / p.price_buy) * 100),
      };
    });

    setSelectedProducts(discounted);
  };

  const totalDiscount = selectedProducts.reduce((sum, p) => {
    return sum + (p.original_price - p.sale_price);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }
    if (!dateBegin || !dateEnd) {
      alert("Vui lòng chọn thời gian áp dụng");
      return;
    }
    if (new Date(dateEnd) < new Date(dateBegin)) {
      alert("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    setLoading(true);

    try {
      // Gửi từng sản phẩm với đầy đủ field bắt buộc
      for (const item of selectedProducts) {
        await promotionService.create({
          name: `Khuyến mãi ${promotionType === "percent" ? discountValue + "%" : discountValue + "đ"} cho ${item.name}`,
          product_id: item.id,
          price_sale: item.sale_price,
          date_begin: dateBegin,
          date_end: dateEnd,
          status: 1,
        });
      }

      alert(`Tạo thành công khuyến mãi cho ${selectedProducts.length} sản phẩm!`);
      router.push("/admin/promotion");
    } catch (err) {
      console.error("Lỗi tạo khuyến mãi:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi tạo khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tạo khuyến mãi mới</h1>
          <button
            onClick={() => router.push("/admin/promotion")}
            className="text-gray-600 hover:text-black flex items-center gap-2"
          >
            ← Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thời gian áp dụng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Thời gian áp dụng
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Thời gian bắt đầu</label>
                  <input
                    type="date"
                    value={dateBegin}
                    onChange={(e) => setDateBegin(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Thời gian kết thúc</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Khuyến mãi sẽ tự động kết thúc vào thời gian này.
                  <br />
                  Sản phẩm sẽ trở về giá gốc.
                </p>
              </div>
            </div>
          </div>

          {/* Thiết lập + Bảng */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Thiết lập nhanh</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={promotionType}
                  onChange={(e) => setPromotionType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                >
                  <option value="percent">Giảm theo %</option>
                  <option value="fixed">Giảm số tiền cố định</option>
                </select>

                <input
                  type="number"
                  placeholder={promotionType === "percent" ? "20" : "100000"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                  min="1"
                  required
                />

                <button
                  type="button"
                  onClick={applyToAll}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-3 font-medium transition"
                >
                  Áp dụng tất cả
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Sản phẩm khuyến mãi</h2>
                <button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                  className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition"
                >
                  <Plus size={20} />
                  Thêm sản phẩm
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">Sản phẩm</th>
                      <th className="px-6 py-4 text-center">Giá gốc</th>
                      <th className="px-6 py-4 text-center">Giá khuyến mãi</th>
                      <th className="px-6 py-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500">
                          Chưa có sản phẩm nào
                          <br />
                          <span className="text-sm">Bấm "Thêm sản phẩm" để bắt đầu</span>
                        </td>
                      </tr>
                    ) : (
                      selectedProducts.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
 <img
  src={item.image ? `/image/${item.image}` : "/placeholder.jpg"}
  alt={item.name}
  className="w-full h-full object-cover"
/>


                              </div>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">SKU: {item.slug || "N/A"}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center text-gray-600">
                            {Number(item.original_price).toLocaleString("vi-VN")}₫
                          </td>

                          <td className="px-6 py-4 text-center">
                            {item.sale_price < item.original_price ? (
                              <div>
                                <span className="text-2xl font-bold text-red-600">
                                  {Number(item.sale_price).toLocaleString("vi-VN")}₫
                                </span>
                                <span className="ml-3 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                                  -{item.discount_percent}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-red-600">Giá không hợp lệ</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => removeProduct(item.id)}
                              className="p-2 hover:bg-red-50 rounded transition text-red-600"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {selectedProducts.length > 0 && (
                <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                  <p className="text-gray-700">
                    Đã chọn <strong>{selectedProducts.length}</strong> sản phẩm
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    TỔNG DOANH THU DỰ KIẾN GIẢM
                    <br />
                    <span className="text-2xl">~ {Number(totalDiscount).toLocaleString("vi-VN")}₫</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                disabled={loading || selectedProducts.length === 0}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-12 py-5 rounded-xl text-xl font-bold transition shadow-xl"
              >
                {loading ? "Đang lưu..." : "LƯU KHUYẾN MÃI"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn sản phẩm */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Chọn sản phẩm khuyến mãi</h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 border-b">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchInModal}
                  onChange={(e) => setSearchInModal(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 py-8">
                    Không tìm thấy sản phẩm nào
                  </p>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => addProductToPromotion(product)}
                      className="cursor-pointer group bg-gray-50 hover:bg-white rounded-xl p-4 shadow hover:shadow-lg transition border-2 border-transparent hover:border-orange-500"
                    >
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                        <img
                          src={product.thumbnail_url || (product.thumbnail ? `/storage/${product.thumbnail}` : "/placeholder.jpg")}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <h4 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h4>
                      <p className="text-gray-600 mb-2">{Number(product.price_buy).toLocaleString("vi-VN")}₫</p>
                      <p className="text-sm text-gray-500">SKU: {product.slug || "N/A"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}