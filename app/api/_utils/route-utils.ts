import { HttpError } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import type { NextRequest } from "next/server";

export const getAuthorizationHeader = (request: NextRequest) => {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return undefined;
  }

  return { Authorization: authorization };
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
    let status = error.status;
    const messageLower = error.message.toLowerCase();
    if (status === 400 && (messageLower.includes('unauthorized') || messageLower.includes('not authenticated') || messageLower.includes('not authorized'))) {
      status = HttpStatusCode.Unauthorized;
    }

    const finalStatus =
      typeof status === "number"
        ? (status as HttpStatusCode)
        : HttpStatusCode.BadRequest;

    return ResponseApi.error(error.message || fallbackMessage, finalStatus, error.data);
  }

  return ResponseApi.error(fallbackMessage, HttpStatusCode.BadRequest);
};
