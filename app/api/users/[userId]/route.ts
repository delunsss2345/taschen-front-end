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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.get(`/api/users/${userId}`, { headers });

    return ResponseApi.success(response, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get User API Error");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const payload = await request.json();
    const headers = getAuthorizationHeader(request);
    const response = await api.put(`/api/users/${userId}`, payload, { headers });

    return ResponseApi.success(response, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Update User API Error",
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const headers = getAuthorizationHeader(request);
    await api.delete(`/api/users/${userId}`, undefined, { headers });

    return ResponseApi.success({ message: "User deleted" }, HttpStatusCode.NoContent);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Delete User API Error",
    );
  }
}
