'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MenuService from "../../../../../../services/MenuService";

export default function AddMenuPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    link: "",
    type: "custom",
    position: "mainmenu",
    sort_order: 0,
    parent_id: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await MenuService.create(form);
    alert("Thêm menu thành công");
    router.push("/admin/menu");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thêm Menu</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded">
        <input
          placeholder="Tên menu"
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="Link"
          className="w-full border p-3 rounded"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          required
        />

        <select
          className="w-full border p-3 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="custom">Custom</option>
          <option value="category">Category</option>
          <option value="topic">Topic</option>
          <option value="page">Page</option>
        </select>

        <select
          className="w-full border p-3 rounded"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        >
          <option value="mainmenu">Main Menu</option>
          <option value="footermenu">Footer Menu</option>
        </select>

        <button className="bg-black text-white px-6 py-3 rounded">
          Thêm menu
        </button>

        <Link href="/admin/menu" className="block text-gray-600 underline">
          Quay lại
        </Link>
      </form>
    </div>
  );
}
