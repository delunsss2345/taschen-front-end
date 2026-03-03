import { NextRequest } from "next/server";
import { api } from "@/lib/api/fetchHandler";
import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { API_MESSAGE } from "@/constants/api/messageApi";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseOrderId: string }> }
) {
  try {
    const { purchaseOrderId } = await params;
    const headers = getAuthorizationHeader(request);
    const body = await request.json();

    const response = await api.put<{ data: unknown }>(
      `purchase-orders/${purchaseOrderId}/cancel`,
      body,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Cancel Purchase Order API Error");
  }
}
