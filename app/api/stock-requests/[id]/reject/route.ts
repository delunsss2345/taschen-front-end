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
  createdById: number;
  createdByName: string;
  processedById: number | null;
  processedByName: string | null;
};

type StockRequestApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: StockRequest;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = getAuthorizationHeader(request);
    const body = await request.json();

    const response = await api.put<StockRequestApiResponse>(
      `stock-requests/${id}/reject`,
      body,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Reject Stock Request API Error"
    );
  }
}
