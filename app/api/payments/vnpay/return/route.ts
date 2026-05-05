import { api } from "@/lib/api/fetchHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const responseCode = searchParams.get("vnp_ResponseCode");

  console.log("[VNPay Return] queryString:", queryString);

  try {
    const res = await api.get<unknown>(`payments/vnpay/return?${queryString}`);
    console.log("[VNPay Return] backend response:", JSON.stringify(res));
    const success = responseCode === "00";
    return NextResponse.redirect(
      new URL(`/payment/vnpay/result?success=${success}&${queryString}`, request.url),
    );
  } catch (error) {
    console.error("[VNPay Return] error:", error);
    return NextResponse.redirect(
      new URL(`/payment/vnpay/result?success=false&${queryString}`, request.url),
    );
  }
}
