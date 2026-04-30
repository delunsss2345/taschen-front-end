import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import type { NotificationResponse } from "@/types/response/notification.response";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type NotificationsApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: NotificationResponse[];
};

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<NotificationsApiResponse>("notifications", { headers });
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, "Không thể tải thông báo", "Get Notifications API Error");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    await api.delete("notifications", undefined, { headers });
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error, "Không thể xóa thông báo", "Delete All Notifications API Error");
  }
}
