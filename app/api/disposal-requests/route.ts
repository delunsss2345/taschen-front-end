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

type DisposalRequestsApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: DisposalRequest[];
};

type DisposalRequestDetailApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: DisposalRequest;
};

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);

    const response = await api.get<DisposalRequestsApiResponse>("disposal-requests", {
      headers,
    });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Disposal Requests API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body = await request.json();

    const response = await api.post<DisposalRequestDetailApiResponse>(
      "disposal-requests",
      body,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create Disposal Request API Error");
  }
}