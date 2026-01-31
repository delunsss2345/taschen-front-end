import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export class ResponseApi {
    static success<T>(payload: T, status: HttpStatusCode = HttpStatusCode.Ok, props = {}) {
        return NextResponse.json({ success: true, ...props, data: payload }, { status });
    }

    static error(
        message: string,
        status: HttpStatusCode = HttpStatusCode.BadRequest,
        details?: unknown
    ) {
        return NextResponse.json(
            { success: false, message, details },
            { status }
        );
    }
}
