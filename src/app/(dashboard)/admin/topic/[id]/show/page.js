"use client";

import Link from "next/link";

const topicData = {
  1: { id: 1, name: "Lập trình Backend", slug: "backend", created_at: "2025-11-01" },
  2: { id: 2, name: "Lập trình Frontend", slug: "frontend", created_at: "2025-11-05" },
  3: { id: 3, name: "Cơ sở dữ liệu", slug: "database", created_at: "2025-11-10" },
};

export default function TopicDetail({ params }) {
  const { id } = params;
  const topic = topicData[id];

  if (!topic) {
    return (
      <div className="text-center text-gray-500 py-20">
        Không tìm thấy chủ đề
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chi tiết chủ đề</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">

        <p>
          <strong>ID:</strong> {topic.id}
        </p>

        <p>
          <strong>Tên chủ đề:</strong> {topic.name}
        </p>

        <p>
          <strong>Slug:</strong> {topic.slug}
        </p>

        <p>
          <strong>Ngày tạo:</strong> {topic.created_at}
        </p>

        <div className="pt-4">
          <Link
            href={`/admin/topic/edit/${topic.id}`}
            className="bg-green-600 text-white px-6 py-3 rounded-lg mr-4"
          >
            Sửa chủ đề
          </Link>

          <Link
            href="/admin/topic"
            className="px-4 py-3 text-gray-600 hover:underline"
          >
            Quay lại
          </Link>
        </div>

      </div>
    </div>
  );
}
