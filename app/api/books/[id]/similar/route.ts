import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const headers = getAuthorizationHeader(request);
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const query = limit ? { limit } : undefined;
    const response = await api.get<{ data: unknown }>(`books/${id}/similar`, { headers, query });
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Similar Books API Error");
  }
}
