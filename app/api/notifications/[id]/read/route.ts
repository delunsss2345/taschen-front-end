import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import type { NotificationResponse } from "@/types/response/notification.response";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type NotificationApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: NotificationResponse;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.patch<NotificationApiResponse>(
      `notifications/${id}/read`,
      {},
      { headers }
    );
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, "Không thể đánh dấu đã đọc", "Mark Notification Read API Error");
  }
}
