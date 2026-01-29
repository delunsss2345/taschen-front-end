import { NextResponse } from "next/server";

export function handleError(error: unknown): NextResponse {
    console.error("Error", {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
        } : error,
    });

    if (error instanceof Error) {
        const message = process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error";
        return NextResponse.json({ message }, { status: 509 })
    }

    return NextResponse.json("Internal server error", { status: 509 })

}