'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MenuService from "../../../../../../../services/MenuService";

export default function EditMenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {
    MenuService.getById(id).then(res => {
      setForm(res.data);
    });
  }, [id]);

  if (!form) return <div>Đang tải...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await MenuService.update(id, form);
    alert("Cập nhật thành công");
    router.push("/admin/menu");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sửa Menu</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded">
        <input
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-3 rounded"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
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
          Cập nhật
        </button>
      </form>
    </div>
  );
}
