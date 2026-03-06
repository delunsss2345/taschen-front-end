import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type DisposalRequestItem = {
  id: number;
  batchId: number;
  quantity: number;
};

type DisposalRequest = {
  id: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  processedAt: string | null;
  responseNote: string | null;
  createdBy: {
    id: number;
    email: string;
  } | null;
  processedBy: {
    id: number;
    email: string;
  } | null;
  items: DisposalRequestItem[];
};

type DisposalRequestDetailApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: DisposalRequest;
};

export async function PUT(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body = await request.json();
    const { responseNote } = body;

    // Extract ID from URL path
    const pathParts = request.nextUrl.pathname.split("/");
    const idIndex = pathParts.indexOf("disposal-requests") + 1;
    const id = pathParts[idIndex];

    const response = await api.put<DisposalRequestDetailApiResponse>(
      `disposal-requests/${id}/approve`,
      { responseNote },
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Approve Disposal Request API Error");
  }
}
