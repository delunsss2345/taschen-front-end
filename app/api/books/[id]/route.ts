import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { BookApiResponse, DeleteBookApiResponse } from "@/types/response/book.response";
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

    const response = await api.get<BookApiResponse>(`books/${id}`, { headers });
    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Get Book By ID API Error",
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const headers = getAuthorizationHeader(request);

    const response = await api.put<BookApiResponse>(`books/${id}`, payload, {
      headers,
    });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Update Book API Error",
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const headers = getAuthorizationHeader(request);

    await api.delete<DeleteBookApiResponse>(`books/${id}`, undefined, { headers });

    return ResponseApi.success(null, HttpStatusCode.Ok);
  } catch (error: unknown) {
    return handleRouteError(
      error,
      'Có lỗi xảy ra khi xóa sách.',
      "Delete Book API Error",
    );
  }
}
