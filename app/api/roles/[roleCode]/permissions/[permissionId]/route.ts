import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleCode: string; permissionId: string }> }
) {
  try {
    const { roleCode, permissionId } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.delete<{ data: unknown }>(
      `roles/${roleCode}/permissions/${permissionId}`,
      undefined,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Remove Permission from Role API Error"
    );
  }
}
