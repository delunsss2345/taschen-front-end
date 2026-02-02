import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { RefreshTokenResponse } from "@/types/response/auth.response";
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
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return ResponseApi.error(API_MESSAGE.REFRESH_TOKEN_MISSING, HttpStatusCode.Unauthorized)
        }

        const response = await api.post<RefreshTokenResponse>("auth/refresh", {
            refreshToken
        })

        cookieStore.set("refreshToken", response.data.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return ResponseApi.success(response.data, HttpStatusCode.Ok);

    }
    catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Refresh Token API Error:", error);
        }
        return ResponseApi.error(
            API_MESSAGE.SYSTEM_TRY_AGAIN, HttpStatusCode.BadRequest
        )
    }
}
