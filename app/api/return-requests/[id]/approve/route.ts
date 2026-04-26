import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type ReturnRequestItem = {
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type ReturnRequest = {
  id: number;
  orderId: number;
  orderTotal: number;
  reason: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  createdById: number;
  createdByName: string;
  processedById: number | null;
  processedByName: string | null;
  items: ReturnRequestItem[];
};

type ReturnRequestApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: ReturnRequest;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = getAuthorizationHeader(request);
    const body = await request.json();

    const response = await api.put<ReturnRequestApiResponse>(
      `return-requests/${id}/approve`,
      body,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Approve Return Request API Error"
    );
  }
}
