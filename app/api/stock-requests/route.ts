import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type StockRequest = {
  id: number;
  quantity: number;
  reason: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  responseMessage: string | null;
  bookId: number;
  bookTitle: string;
  variantId: number | null;
  variantName: string | null;
  createdById: number;
  createdByName: string;
  processedById: number | null;
  processedByName: string | null;
};

type StockRequestsApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: StockRequest[];
};

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);

    const response = await api.get<StockRequestsApiResponse>("stock-requests", {
      headers,
    });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Stock Requests API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body = await request.json();

    const response = await api.post<{ error: string | null; message: string; statusCode: number; data: StockRequest }>(
      "stock-requests",
      body,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create Stock Request API Error");
  }
}
