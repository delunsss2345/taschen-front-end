import { api } from "@/lib/api/fetchHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const responseCode = searchParams.get("vnp_ResponseCode");

  try {
    await api.get<unknown>(`payments/vnpay/return?${queryString}`);
    const success = responseCode === "00";
    return NextResponse.redirect(
      new URL(`/payment/vnpay/result?success=${success}&${queryString}`, request.url),
    );
  } catch {
    return NextResponse.redirect(
      new URL(`/payment/vnpay/result?success=false&${queryString}`, request.url),
    );
  }
}
