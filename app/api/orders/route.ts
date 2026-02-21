import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get("/api/orders", { headers });

    return ResponseApi.success(response, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Orders API Error");
  }
}
