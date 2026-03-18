"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VNPayReturnPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("processing");

    useEffect(() => {
        const responseCode = searchParams.get("vnp_ResponseCode");
        
        if (responseCode === "00") {
            // Thanh toán thành công
            setStatus("success");
            // Xóa giỏ hàng local sau khi thanh toán thành công
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData) {
                localStorage.removeItem(`cart_user_${userData.id}`);
                window.dispatchEvent(new Event("cartUpdated"));
            }
        } else {
            // Thanh toán thất bại hoặc người dùng hủy
            setStatus("error");
        }
    }, [searchParams]);

    if (status === "processing") return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            {status === "success" ? (
                <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center border border-green-100">
                    <CheckCircle2 size={80} className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-gray-900">Thanh toán thành công!</h1>
                    <p className="text-gray-500 mt-2">Đơn hàng của bạn đã được ghi nhận vào hệ thống.</p>
                    <button onClick={() => router.push("/")} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold">Về trang chủ</button>
                </div>
            ) : (
                <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center border border-red-100">
                    <XCircle size={80} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-gray-900">Giao dịch thất bại</h1>
                    <p className="text-gray-500 mt-2">Cửa sổ thanh toán đã bị đóng hoặc lỗi thẻ.</p>
                    <button onClick={() => router.push("/checkout")} className="mt-8 bg-red-600 text-white px-8 py-3 rounded-2xl font-bold">Thanh toán lại</button>
                </div>
            )}
        </div>
    );
}