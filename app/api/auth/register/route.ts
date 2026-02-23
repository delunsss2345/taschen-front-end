import { handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import type { RegisterApiResponse } from "@/types/response/auth.response";
import { RegisterSchema } from "@/validation/auth/registerValidation";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = RegisterSchema.safeParse(payload);

    if (!parsed.success) {
      return ResponseApi.error(
        API_MESSAGE.REGISTER_VALIDATION_FAILED,
        HttpStatusCode.UnprocessableEntity,
      );
    }

    const response = await api.post<RegisterApiResponse>("/api/auth/register", payload);

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Register API Error",
    );
  }
}
