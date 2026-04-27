import { HttpError } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import type { NextRequest } from "next/server";

export const getAuthorizationHeader = (request: NextRequest) => {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return undefined;
  }

  return { Authorization: authorization };
};

export const handleRouteError = (
  error: unknown,
  fallbackMessage: string,
  logLabel: string,
) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`${logLabel}:`, JSON.stringify(error, null, 2));
  }

  if (error instanceof HttpError) {
    let status = error.status;
    const messageLower = error.message.toLowerCase();

    if (status === 400 && (messageLower.includes('unauthorized') || messageLower.includes('not authenticated') || messageLower.includes('not authorized'))) {
      status = HttpStatusCode.Unauthorized;
    }

    const errorData = error.data as { error?: string; message?: string } | undefined;
    const rawMessage = errorData?.message || errorData?.error || error.message;
    const rawLower = rawMessage.toLowerCase();

    let userMessage = fallbackMessage;
    if (rawLower.includes('foreign key') || rawLower.includes('constraint fails')) {
      if (rawLower.includes('import_stock_details')) {
        userMessage = 'Không thể xóa sách vì đang có dữ liệu nhập kho liên quan.';
      } else if (rawLower.includes('order_details')) {
        userMessage = 'Không thể xóa sách vì đang có đơn hàng liên quan.';
      } else if (rawLower.includes('cart')) {
        userMessage = 'Không thể xóa sách vì đang có giỏ hàng liên quan.';
      } else if (rawLower.includes('favourite') || rawLower.includes('favorite')) {
        userMessage = 'Không thể xóa sách vì đang có trong danh sách yêu thích.';
      } else {
        userMessage = 'Không thể xóa vì có dữ liệu liên quan.';
      }
    } else {
      userMessage = rawMessage || fallbackMessage;
    }

    const finalStatus =
      typeof status === "number"
        ? (status as HttpStatusCode)
        : HttpStatusCode.BadRequest;

    return ResponseApi.error(userMessage, finalStatus, error.data);
  }

  return ResponseApi.error(fallbackMessage, HttpStatusCode.BadRequest);
};
