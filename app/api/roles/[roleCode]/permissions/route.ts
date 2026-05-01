import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roleCode: string }> }
) {
  try {
    const { roleCode } = await params;
    const payload = await request.json();
    const headers = getAuthorizationHeader(request);
    const response = await api.post<{ data: unknown }>(
      `roles/${roleCode}/permissions`,
      payload,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Assign Permissions to Role API Error"
    );
  }
}
