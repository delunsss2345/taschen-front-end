import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { VerifyAccountResponse } from "@/types/response/auth.response";
import { VerifyEmailSchema } from "@/validation/auth/verifyEmailValidation";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const payload = await request.json();
        const parsed = VerifyEmailSchema.safeParse(payload);

        if (!parsed.success) {
            return ResponseApi.error(API_MESSAGE.VERIFY_VALIDATION_FAILED, HttpStatusCode.UnprocessableEntity)
        }

        const response = await api.post<VerifyAccountResponse>(`auth/verify/${userId}`, {
            ...payload
        })

        return ResponseApi.success(response, HttpStatusCode.Ok);

    }
    catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Verify Email API Error:", error);
        }
        return ResponseApi.error(
            API_MESSAGE.SYSTEM_TRY_AGAIN, HttpStatusCode.BadRequest
        )
    }
}
