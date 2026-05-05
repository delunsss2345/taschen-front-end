import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    console.log("[VNPay Create] orderId:", orderId);
    const headers = getAuthorizationHeader(request);
    const response = await api.post<{ data: unknown }>(
      `payments/vnpay/create/${orderId}`,
      {},
      { headers },
    );
    console.log("[VNPay Create] raw response:", JSON.stringify(response));
    console.log("[VNPay Create] response.data:", JSON.stringify(response.data));
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    console.error("[VNPay Create] error:", error);
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create VNPay Payment API Error");
  }
}
