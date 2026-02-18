import { handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { LogoutApiResponse } from "@/types/response/auth.response";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await api.post<LogoutApiResponse>("auth/logout", payload);

    const cookieStore = await cookies();
    cookieStore.set("refreshToken", "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
    });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Logout API Error",
    );
  }
}
