'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Thành phần con để sử dụng useSearchParams (Bắt buộc bọc Suspense trong Next.js 13+)
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // GIẢ LẬP GỌI API (Thay URL này bằng API thật của bạn)
        // const res = await fetch(`https://api.yourstore.com/products?search=${query}`);
        // const data = await res.json();
        
        // Demo logic lọc thực tế:
        const demoData = [
          { id: 1, name: 'Tabby Shoulder Bag 26', price: '9.500.000', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600' },
          { id: 2, name: 'Avery Leather Tote', price: '12.200.000', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600' },
          { id: 3, name: 'Mini Crossbody Bag', price: '4.500.000', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600' },
          { id: 4, name: 'Brooklyn Hobo Bag', price: '15.000.000', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600' },
        ];

        // Lọc dữ liệu dựa trên query
        const filtered = demoData.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        );

        // Giả lập độ trễ mạng cho mượt mà
        setTimeout(() => {
          setProducts(filtered);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  // Logic phân trang
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600 mb-4" />
        <p className="text-gray-500 tracking-widest text-sm">ĐANG TÌM KIẾM...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16">
        <h1 className="text-3xl font-serif tracking-widest mb-2 uppercase">Kết quả cho: "{query}"</h1>
        <p className="text-gray-400 text-sm italic">Tìm thấy {products.length} tuyệt tác phù hợp</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
          <Search size={48} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-xl font-serif mb-4">Rất tiếc, không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Chúng tôi không tìm thấy kết quả phù hợp với từ khóa của bạn. Hãy thử một từ khóa khác hoặc liên hệ để đặt thiết kế riêng.</p>
          <Link href="/product" className="inline-block border-b border-black pb-1 text-sm font-bold tracking-tighter hover:text-rose-600 hover:border-rose-600 transition">
            KHÁM PHÁ TẤT CẢ SẢN PHẨM
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {currentItems.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-[13px] font-bold tracking-widest uppercase mb-2 group-hover:text-rose-700 transition">
                  {product.name}
                </h3>
                <p className="text-sm font-light text-gray-600">{product.price} VNĐ</p>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 mt-24">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-20 hover:text-rose-600 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[12px] tracking-[0.3em] font-bold">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="disabled:opacity-20 hover:text-rose-600 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Page chính
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-40 text-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}