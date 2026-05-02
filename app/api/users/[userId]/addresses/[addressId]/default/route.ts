import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; addressId: string }> },
) {
  try {
    const { userId, addressId } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.put<{ data: unknown }>(`users/me/addresses/${addressId}/default`, {}, { headers });
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Set Default Address API Error");
  }
}
