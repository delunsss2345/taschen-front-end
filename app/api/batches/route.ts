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

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<ApiResponseEnvelope<unknown>>("batches", { headers });

    return ResponseApi.success(response, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Batches API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body = await request.json();
    
    const response = await api.post<ApiResponseEnvelope<unknown>>("batches", body, { headers });

    return ResponseApi.success(response, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create Batch API Error");
  }
}