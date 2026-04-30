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
