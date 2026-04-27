import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { BooksApiResponse } from "@/types/response/book.response";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const { searchParams } = new URL(request.url);

    const query: Record<string, string> = {};
    for (const key of ["keyword", "categoryId", "status", "page", "size", "sortBy", "sortDir"]) {
      const val = searchParams.get(key);
      if (val !== null) query[key] = val;
    }

    const response = await api.get<BooksApiResponse>("books/search", {
      headers,
      query: Object.keys(query).length > 0 ? query : undefined,
    });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Search Books API Error");
  }
}
