import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const headers = getAuthorizationHeader(request);

    const query: Record<string, string> = {};
    ["name", "code", "status", "isActive"].forEach((key) => {
      const val = searchParams.get(key);
      if (val !== null) query[key] = val;
    });

    const response = await api.get<{ data: unknown[] }>("promotions/search", {
      headers,
      query,
    });
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Search Promotions API Error");
  }
}
