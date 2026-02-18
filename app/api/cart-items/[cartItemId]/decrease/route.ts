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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ cartItemId: string }> },
) {
  try {
    const { cartItemId } = await params;
    const headers = getAuthorizationHeader(request);

    const response = await api.patch<CartItemApiResponse>(
      `cart-items/${cartItemId}/decrease`,
      {},
      { headers },
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Decrease Cart Item API Error",
    );
  }
}
