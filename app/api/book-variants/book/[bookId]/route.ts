import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { ApiResponseEnvelope } from "@/services/helpers/response";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.get<ApiResponseEnvelope<unknown>>(
      `book-variants/book/${bookId}`,
      { headers }
    );

    return ResponseApi.success(response, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Get Book Variants API Error"
    );
  }
}
