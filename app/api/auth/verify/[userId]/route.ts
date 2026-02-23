import { handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import type { VerifyAccountApiResponse } from "@/types/response/auth.response";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { VerifyEmailSchema } from "@/validation/auth/verifyEmailValidation";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const payload = await request.json();
    const parsed = VerifyEmailSchema.safeParse(payload);

    if (!parsed.success) {
      return ResponseApi.error(
        API_MESSAGE.VERIFY_VALIDATION_FAILED,
        HttpStatusCode.UnprocessableEntity,
      );
    }

    const response = await api.post<VerifyAccountApiResponse>(
      `/api/auth/verify/${userId}`,
      payload,
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Verify Email API Error",
    );
  }
}
