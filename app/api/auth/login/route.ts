import { handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import type { LoginApiResponse } from "@/types/response/auth.response";
import { LoginSchema } from "@/validation/auth/loginValidation";
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
    const parsed = LoginSchema.safeParse(payload);

    if (!parsed.success) {
      return ResponseApi.error(
        API_MESSAGE.AUTH_EMAIL_PASSWORD_EMPTY,
        HttpStatusCode.UnprocessableEntity,
      );
    }

    const response = await api.post<LoginApiResponse>("/api/auth/login", payload);

    const cookieStore = await cookies();
    cookieStore.set("refreshToken", response.data.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Login API Error");
  }
}
