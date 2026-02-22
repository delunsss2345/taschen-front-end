import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<{ data: unknown }>("/api/users", { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Users API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const headers = getAuthorizationHeader(request);
    console.log('[CREATE USER] Payload:', JSON.stringify(payload));
    const response = await api.post<{ data: unknown }>("/api/users", payload, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error: unknown) {
    console.error('[CREATE USER] Error:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } };
      console.error('[CREATE USER] Backend error:', JSON.stringify(axiosError.response?.data));
    }
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Create User API Error",
    );
  }
}
