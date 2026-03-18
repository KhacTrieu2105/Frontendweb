'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Heart, User, Menu, X, AlertCircle, Loader2 } from 'lucide-react';
import CategoryService from "../../../../services/CategoryService";

export default function CategoryListPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await CategoryService.getList();
        console.log("📂 Categories API response:", response?.data);

        if (response?.data && Array.isArray(response.data)) {
          // Transform categories to include fallback images
          const categoriesWithImages = response.data.map(cat => ({
            ...cat,
            image: cat.image || getCategoryFallbackImage(cat.id)
          }));
          setCategories(categoriesWithImages);
        } else {
          setError("Không thể tải danh mục sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Lỗi kết nối máy chủ");

        // Fallback to mock data if API fails
        setCategories([
          {
            id: 1,
            name: "Túi xách nữ",
            slug: "tui-xach-nu",
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"
          },
          {
            id: 2,
            name: "Túi xách nam",
            slug: "tui-xach-nam",
            image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600"
          },
          {
            id: 3,
            name: "Túi tote",
            slug: "tui-tote",
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fallback images for categories without images
  const getCategoryFallbackImage = (categoryId) => {
    const fallbackImages = {
      1: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", // Women's bags
      2: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600", // Men's bags
      3: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", // Tote bags
      4: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600", // Luxury bags
    };
    return fallbackImages[categoryId] || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-1 flex justify-center md:justify-start">
                <Link href="/" className="text-3xl font-extrabold tracking-wide hover:text-gray-700 transition-colors">
                  BAG SHOP
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh mục...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-1 flex justify-center md:justify-start">
                <Link href="/" className="text-3xl font-extrabold tracking-wide hover:text-gray-700 transition-colors">
                  BAG SHOP
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải danh mục</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Banner */}
      <section className="relative h-[600px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">Gift yourself first.</h2>
            <p className="text-xl md:text-2xl">Embrace every holiday moment with beautiful styles by your side.</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <a 
              key={cat.id} 
              href={`/category/${cat.slug}`}
              className="group cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="text-lg font-medium text-center">{cat.name}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* SEASON SECTION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Made for wherever the season takes you.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-96 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop" 
                alt="Leather Bags"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Leather Collection</h3>
                  <button className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            <div className="relative h-96 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=400&fit=crop" 
                alt="Shoulder Bag"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Signature Styles</h3>
                  <button className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
