import { handleRouteError } from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import type { RegisterApiResponse } from "@/types/response/auth.response";
import { RegisterSchema } from "@/validation/auth/registerValidation";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = RegisterSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => e.message);
      return ResponseApi.error(
        errors[0] || API_MESSAGE.REGISTER_VALIDATION_FAILED,
        HttpStatusCode.BadRequest,
      );
    }

    const response = await api.post<RegisterApiResponse>("auth/register", parsed.data);

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((e) => e.message);
      return ResponseApi.error(
        errors[0] || API_MESSAGE.REGISTER_VALIDATION_FAILED,
        HttpStatusCode.BadRequest,
      );
    }
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Register API Error",
    );
  }
}
