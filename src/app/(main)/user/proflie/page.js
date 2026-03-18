"use client";
import React, { useState, useEffect } from "react";
import { 
  User, Package, Lock, Camera, 
  ChevronRight, AlertCircle, Loader2, XCircle, CheckCircle,Link 
} from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/NguyenKhacTrieu_backend/public/api",
});

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (savedUser) setUser(savedUser);
    
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders"); // Đã sửa theo api.php của bạn
      setOrders(res.data.orders || res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.target);
    
    /** * QUAN TRỌNG: Laravel không đọc được FormData nếu dùng PUT trực tiếp.
     * Ta phải gửi POST và thêm trường _method = PUT.
     */
    formData.append("_method", "PUT"); 

    try {
      // Dùng .post thay vì .put
      const res = await api.post("/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.status) {
        // Cập nhật lại LocalStorage và State để UI thay đổi ngay lập tức
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Lỗi cập nhật thông tin." 
      });
    } finally { 
      setLoading(false); 
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Tự động submit avatar khi chọn file (tùy chọn)
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("name", user.name); // Gửi kèm các field required
    formData.append("_method", "PUT");

    setLoading(true);
    try {
        const res = await api.post("/user/update-profile", formData);
        if (res.data.status) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);
            setMessage({ type: "success", text: "Đã cập nhật ảnh đại diện!" });
        }
    } catch (err) {
        setMessage({ type: "error", text: "Không thể upload ảnh." });
    } finally { setLoading(false); }
  };

  // 2. CHỨC NĂNG ĐỔI MẬT KHẨU
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validation phía client
    if (data.new_password !== data.confirm_password) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp!" });
      setLoading(false);
      return;
    }

    if (data.new_password.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
      setLoading(false);
      return;
    }

    console.log("📡 Changing password with data:", {
      old_password: "***",
      new_password: "***",
      confirm_password: "***"
    });

    try {
      const res = await api.put("/user/change-password", {
        old_password: data.old_password,
        new_password: data.new_password,
        new_password_confirmation: data.confirm_password
      });

      console.log("📨 Password change response:", res.data);

      if (res.data.status) {
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
        // Reset form
        e.target.reset();
      }
    } catch (error) {
      console.error("❌ Password change error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      setMessage({
        type: "error",
        text: error.response?.data?.message || "Lỗi đổi mật khẩu. Vui lòng thử lại."
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. HỦY ĐƠN HÀNG
  const handleCancelOrder = async (orderId) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      if (res.data.status) {
        setMessage({ type: "success", text: "Đã hủy đơn hàng thành công!" });
        // Refresh orders
        fetchOrders();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Không thể hủy đơn hàng. Vui lòng thử lại." });
    }
  };

  if (!user) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                <img 
                  src={user.avatar ? `http://localhost/NguyenKhacTrieu_backend/public/storage/${user.avatar}` : `https://ui-avatars.com/api/?name=${user.name}`} 
                  className="w-full h-full rounded-full object-cover border-4 border-indigo-50"
                  alt="Avatar"
                />
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-lg">
                    <Camera size={18} />
                    <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                </label>
              </div>
              <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm font-medium">{user.email}</p>
            </div>

            <nav className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 space-y-2">
              <button onClick={() => setActiveTab("info")} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'info' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                <div className="flex items-center gap-3 font-bold"><User size={20}/> Thông tin cá person</div>
                <ChevronRight size={18} />
              </button>
              <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                <div className="flex items-center gap-3 font-bold"><Package size={20}/> Đơn hàng của tôi</div>
                <ChevronRight size={18} />
              </button>
              <button onClick={() => setActiveTab("password")} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'password' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                <div className="flex items-center gap-3 font-bold"><Lock size={20}/> Đổi mật khẩu</div>
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 min-h-[500px]">
              {message.text && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                  {message.text}
                </div>
              )}

              {activeTab === "info" && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <h3 className="text-2xl font-black mb-8">Cập nhật hồ sơ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Họ tên</label>
                        <input name="name" defaultValue={user.name} required className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Số điện thoại</label>
                        <input name="phone" defaultValue={user.phone} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Địa chỉ</label>
                        <textarea name="address" defaultValue={user.address} rows={3} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"></textarea>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18}/> : "Lưu thay đổi"}
                  </button>
                </form>
              )}

              {/* TAB 2: ĐƠN HÀNG */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black mb-8">Lịch sử đơn hàng</h3>
                  {orders.length === 0 ? (
                    <p className="text-gray-400 italic">Bạn chưa có đơn hàng nào.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-3xl p-6 hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Mã đơn: #{order.id}</p>
                                <p className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {order.status === 'pending' ? 'Chờ xác thực' : 'Đã xác nhận'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-black text-indigo-600">{order.total_amount?.toLocaleString()}₫</span>
                            <div className="flex gap-2">
                              <Link
                                href={`/user/orders/${order.id}`}
                                className="bg-indigo-600 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-indigo-700 transition flex items-center gap-1"
                              >
                                Xem chi tiết
                              </Link>
                              {order.status === 'pending' && (
                                <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="text-red-500 font-bold text-xs flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded-xl transition"
                                >
                                    <XCircle size={14}/> Hủy đơn
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ĐỔI MẬT KHẨU */}
              {activeTab === "password" && (
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  <h3 className="text-2xl font-black mb-8">Đổi mật khẩu</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Mật khẩu hiện tại</label>
                        <input
                          name="old_password"
                          type="password"
                          required
                          className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Mật khẩu mới</label>
                        <input
                          name="new_password"
                          type="password"
                          required
                          minLength={6}
                          className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Xác nhận mật khẩu</label>
                        <input
                          name="confirm_password"
                          type="password"
                          required
                          minLength={6}
                          className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18}/> : "Cập nhật mật khẩu"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
