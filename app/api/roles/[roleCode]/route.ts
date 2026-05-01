import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleCode: string }> }
) {
  try {
    const { roleCode } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.get<{ data: unknown }>(`roles/${roleCode}`, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Role API Error");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roleCode: string }> }
) {
  try {
    const { roleCode } = await params;
    const payload = await request.json();
    const headers = getAuthorizationHeader(request);
    const response = await api.put<{ data: unknown }>(`roles/${roleCode}`, payload, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Update Role API Error",
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleCode: string }> }
) {
  try {
    const { roleCode } = await params;
    const headers = getAuthorizationHeader(request);
    await api.delete(`roles/${roleCode}`, {}, { headers });

    return ResponseApi.success({ message: "Role deleted successfully" }, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Delete Role API Error",
    );
  }
}
