import { api } from "@/lib/api/fetchHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const responseCode = searchParams.get("vnp_ResponseCode");

  try {
    const res = await api.get<{ orderId?: string }>(`payments/vnpay/return?${queryString}`);
    const success = responseCode === "00";
    const orderId = res?.orderId;
    const params = new URLSearchParams({ status: success ? "success" : "failed" });
    if (orderId) params.set("orderId", orderId);
    if (!success) params.set("message", `Thanh toán thất bại (mã lỗi: ${responseCode})`);
    return NextResponse.redirect(
      new URL(`/payment-result?${params.toString()}`, request.url),
    );
  } catch {
    const params = new URLSearchParams({ status: "failed", message: "Lỗi xác minh thanh toán từ VNPay" });
    return NextResponse.redirect(
      new URL(`/payment-result?${params.toString()}`, request.url),
    );
  }
}
