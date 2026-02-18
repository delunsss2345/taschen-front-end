import { HttpError } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import type { NextRequest } from "next/server";

export const getAuthorizationHeader = (request: NextRequest) => {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return undefined;
  }

  return { authorization };
};

export const handleRouteError = (
  error: unknown,
  fallbackMessage: string,
  logLabel: string,
) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`${logLabel}:`, error);
  }

  if (error instanceof HttpError) {
    const status =
      typeof error.status === "number"
        ? (error.status as HttpStatusCode)
        : HttpStatusCode.BadRequest;

    return ResponseApi.error(error.message || fallbackMessage, status, error.data);
  }

  return ResponseApi.error(fallbackMessage, HttpStatusCode.BadRequest);
};
