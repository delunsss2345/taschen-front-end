import { handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { RefreshTokenApiResponse } from "@/types/response/auth.response";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return ResponseApi.error(
        API_MESSAGE.REFRESH_TOKEN_MISSING,
        HttpStatusCode.Unauthorized,
      );
    }

    const response = await api.post<RefreshTokenApiResponse>("api/auth/refresh", {
      refreshToken,
    });

    cookieStore.set("refreshToken", response.data.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Refresh Token API Error",
    );
  }
}
