import { envConfig } from "@/config/envConfig";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = envConfig.BACKEND_API_URL;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.email || !body.password) {
            return ResponseApi.error('Tài khoản hoặc mật khẩu không được trống', HttpStatusCode.UnprocessableEntity)
        }
        const backendResponse = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: body.email,
                password: body.password,
            }),
        });

        const backendData = await backendResponse.json();
        if (!backendResponse.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: backendData.message || "Đăng nhập thất bại"
                },
                { status: backendResponse.status }
            );
        }
        const cookieStore = await cookies();

        cookieStore.set("refreshToken", backendData.data.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 7,
        });
        return NextResponse.json({
            success: true,
            data: {
                ...backendData.data
            },
        });

    }
    catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi hệ thống, vui lòng thử lại" },
            { status: 500 }
        );
    }
}