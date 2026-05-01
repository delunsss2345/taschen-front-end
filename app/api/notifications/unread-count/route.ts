import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type UnreadCountApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: { unreadCount: number };
};

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<UnreadCountApiResponse>(
      "notifications/unread-count",
      { headers }
    );
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, "Không thể lấy số thông báo chưa đọc", "Get Unread Count API Error");
  }
}
