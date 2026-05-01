import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type ReadAllApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: { message: string };
};

export async function PATCH(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.patch<ReadAllApiResponse>(
      "notifications/read-all",
      {},
      { headers }
    );
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, "Không thể đánh dấu tất cả đã đọc", "Mark All Read API Error");
  }
}
