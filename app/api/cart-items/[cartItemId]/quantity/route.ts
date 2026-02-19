import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { CartItemApiResponse } from "@/types/response/cart.response";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cartItemId: string }> },
) {
  try {
    const { cartItemId } = await params;
    const payload = await request.json();
    const headers = getAuthorizationHeader(request);

    const response = await api.put<CartItemApiResponse>(
      `cart-items/${cartItemId}/quantity`,
      payload,
      { headers },
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Update Cart Item Quantity API Error",
    );
  }
}
