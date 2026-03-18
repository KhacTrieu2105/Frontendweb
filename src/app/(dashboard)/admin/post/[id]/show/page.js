"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "Hướng dẫn Laravel CRUD chi tiết",
    category: "Backend",
    content:
      "Bài viết này hướng dẫn bạn cách làm CRUD Laravel từ A đến Z...",
    author: "Admin",
    created_at: "2025-11-01",
  },
  {
    id: 2,
    title: "Cách sử dụng Next.js App Router",
    category: "Frontend",
    content: "Giới thiệu về cách hoạt động của App Router Next.js...",
    author: "Triệu Sấu Chai",
    created_at: "2025-11-03",
  },
];

export default function PostDetailPage() {
  const { id } = useParams();
  const post = mockPosts.find((p) => p.id == id);

  if (!post)
    return (
      <p className="text-center mt-10 text-gray-500">Không tìm thấy bài viết</p>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/post" className="text-gray-600 hover:text-black">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Chi tiết bài viết</h1>
      </div>

      <div className="bg-white border shadow-sm rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="text-gray-500">Danh mục: <b>{post.category}</b></p>
        <p className="text-gray-500">
          Tác giả: <b>{post.author}</b> — Ngày đăng: {post.created_at}
        </p>

        <div className="border-t pt-4 leading-relaxed text-gray-700 whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </div>
  );
}
