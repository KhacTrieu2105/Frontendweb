"use client";

import { useEffect, useState } from "react";
import SettingService from "../../../../../services/SettingService";

export default function SettingsPage() {
  const [form, setForm] = useState({
    site_name: "",
    email: "",
    phone: "",
    hotline: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await SettingService.get();
        if (res.status) {
          setForm(res.data);
        }
      } catch (err) {
        alert("Không tải được cấu hình website");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await SettingService.update(form);
      alert("Cập nhật thành công");
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">
        Cấu hình website
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
      >
        <Input
          label="Tên website"
          value={form.site_name}
          onChange={(e) =>
            setForm({ ...form, site_name: e.target.value })
          }
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <Input
          label="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <Input
          label="Hotline"
          value={form.hotline}
          onChange={(e) =>
            setForm({ ...form, hotline: e.target.value })
          }
        />

        <Input
          label="Địa chỉ"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <div className="flex justify-end">
          <button
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* Component input */
function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
        {...props}
      />
    </div>
  );
}
