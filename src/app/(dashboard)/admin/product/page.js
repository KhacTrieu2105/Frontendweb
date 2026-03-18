  "use client";

  import Link from "next/link";
  import ProductService from "../../../../../services/ProductService";
  import { Plus, Pencil, Trash2, Eye, Search, Tag, Box, Loader2 } from "lucide-react";
  import { useState, useEffect, useCallback } from "react";

  export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    // ================== FETCH DATA ==================
    const fetchProducts = useCallback(async () => {
      setLoading(true);
      try {
        const response = await ProductService.getList(page, 10, searchTerm);
        if (response?.status === true) {
          setProducts(response.data || []);
          const lastPage = response.pagination?.last_page || 1;
          setPages(Array.from({ length: lastPage }, (_, i) => i + 1));
        } else {
          setError("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        console.error("Fetch products error:", err);
        setError("Không kết nối được server!");
      } finally {
        setLoading(false);
      }
    }, [page, searchTerm]);

    // Fetch khi page/search thay đổi HOẶC khi refreshKey thay đổi
    useEffect(() => {
      fetchProducts();
    }, [fetchProducts, refreshKey]);

    // ================== REFRESH LOGIC ==================
    useEffect(() => {
      const checkForUpdate = () => {
        if (typeof window !== "undefined") {
          const updatedFlag = localStorage.getItem("product-updated");
          const forceRefreshTrigger = localStorage.getItem("force-refresh-trigger");

          if (updatedFlag || forceRefreshTrigger) {
            // Kiểm tra xem update có gần đây không (trong vòng 30 giây)
            const updateTime = parseInt(updatedFlag || forceRefreshTrigger);
            const now = Date.now();
            const timeDiff = now - updateTime;

            if (timeDiff < 30000) { // 30 seconds
              localStorage.removeItem("product-updated");
              localStorage.removeItem("last-updated-product-id");
              localStorage.removeItem("force-refresh-trigger");

              console.log("Product updated recently, refreshing admin list...");
              // Delay 1000ms để đảm bảo Server đã xử lý xong
              setTimeout(() => {
                setRefreshKey(prev => prev + 1);
              }, 1000);
            } else {
              // Xóa flag cũ
              localStorage.removeItem("product-updated");
              localStorage.removeItem("last-updated-product-id");
              localStorage.removeItem("force-refresh-trigger");
            }
          }
        }
      };

      checkForUpdate();

      // Listen for storage changes (cross-window communication)
      const handleStorageChange = (e) => {
        if (e.key === "force-refresh-trigger" || e.key === "product-updated") {
          console.log("Storage changed, checking for updates...");
          checkForUpdate();
        }
      };

      const handleFocus = () => {
        if (!loading) {
          console.log("Admin list focused, checking for updates...");
          checkForUpdate();
        }
      };

      const handleVisibility = () => {
        if (!document.hidden) {
          console.log("Admin list visible, checking for updates...");
          checkForUpdate();
        }
      };

      const handleRefresh = (e) => {
        console.log("Admin list received refresh event:", e.detail);
        if (e.detail?.from === "edit-product" || e.detail?.source === "product-update") {
          setRefreshKey(prev => prev + 1);
        }
      };

      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleVisibility);
      window.addEventListener("product-list-refresh", handleRefresh);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("focus", handleFocus);
        document.removeEventListener("visibilitychange", handleVisibility);
        window.removeEventListener("product-list-refresh", handleRefresh);
      };
    }, [loading]);

    // ================== DELETE ==================
    const handleDeleteClick = (product) => {
      setDeletingProduct(product);
      setShowDeleteModal(true);
    };

    const handleDelete = async () => {
      if (!deletingProduct) return;
      try {
        await ProductService.delete(deletingProduct.id);
        setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
        setShowDeleteModal(false);
        setDeletingProduct(null);
      } catch (err) {
        alert("Xóa thất bại!");
      }
    };

    return (
      <div className="p-6 min-h-screen bg-[#F8F9FA] font-sans">
        <div className="max-w-full mx-auto space-y-8">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#1E1E2D] tracking-tight">
                QUẢN LÝ <span className="text-rose-500">SẢN PHẨM</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Quản lý danh sách, số lượng và thuộc tính sản phẩm.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl w-[300px] outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
                />
              </div>
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-medium shadow-lg"
              >
                🔄 Làm mới
              </button>
              <Link
                href="/admin/product/add"
                className="bg-[#1E1E2D] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" /> Thêm sản phẩm
              </Link>
            </div>
          </div>

          {/* STATS PREVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Box size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng hiện thị</p>
                <p className="text-2xl font-black text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden relative">
            {/* Overlay loading nhẹ khi đang refetch */}
            {loading && products.length > 0 && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-rose-500" size={32} />
              </div>
            )}

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hình</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thuộc tính</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-rose-500" size={40} />
                        <span className="text-gray-500 font-medium">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500 italic">Không tìm thấy sản phẩm</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">#{product.id}</td>
                      <td className="px-6 py-4">
                        {product.thumbnail_url ? (
                          <img 
                            /* Thêm timestamp để xóa cache trình duyệt cho ảnh */
                            src={`${product.thumbnail_url}?t=${refreshKey}`} 
                            alt={product.name} 
                            className="w-12 h-12 rounded-lg object-cover border shadow-sm"
                            onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Error"; }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase">No Pic</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                        <div className="text-xs text-gray-400 font-mono line-clamp-1">{product.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {product.formatted_attributes?.map((attr, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-md border border-blue-100 whitespace-nowrap">
                              <Tag size={10} /> {attr.attribute_name}: {attr.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Box size={14} className={product.qty <= 5 ? "text-red-500" : "text-gray-400"} />
                          <span className={`font-bold ${product.qty <= 5 ? "text-red-600" : "text-gray-900"}`}>{product.qty ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{Number(product.price_buy).toLocaleString("vi-VN")}₫</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.status == 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {product.status == 1 ? "Hoạt động" : "Ẩn"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1">
                          <Link href={`/admin/product/${product.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Eye size={18} /></Link>
                          <Link href={`/admin/product/${product.id}/edit`} className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"><Pencil size={18} /></Link>
                          <button onClick={() => handleDeleteClick(product)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {!loading && pages.length > 1 && (
              <div className="flex justify-center items-center gap-2 py-6 border-t bg-gray-50/30">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 border bg-white rounded-lg disabled:opacity-40 hover:bg-gray-50">‹</button>
                {pages.map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`min-w-[40px] h-10 border rounded-lg font-medium transition-all ${p === page ? "bg-[#1E1E2D] text-white border-[#1E1E2D] shadow-lg" : "bg-white text-gray-600 hover:border-rose-500"}`}>{p}</button>
                ))}
                <button disabled={page === pages.length} onClick={() => setPage(page + 1)} className="p-2 border bg-white rounded-lg disabled:opacity-40 hover:bg-gray-50">›</button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && deletingProduct && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto"><Trash2 size={28} /></div>
              <h3 className="text-xl font-bold mb-2 text-center">Xác nhận xóa?</h3>
              <p className="mb-8 text-gray-500 text-center text-sm leading-relaxed">Sản phẩm <span className="font-bold text-gray-900">"{deletingProduct.name}"</span> sẽ bị loại bỏ khỏi hệ thống.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-all">Hủy</button>
                <button onClick={handleDelete} className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold shadow-lg shadow-red-200 transition-all">Xóa ngay</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
