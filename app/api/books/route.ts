import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { BooksApiResponse, BookApiResponse } from "@/types/response/book.response";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<BooksApiResponse>("books", { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Books API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const headers = getAuthorizationHeader(request);
    const response = await api.post<BookApiResponse>("books", payload, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Create Book API Error",
    );
  }
}
