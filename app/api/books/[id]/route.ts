import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const response = await api.get<unknown>(`books/${id}`);
        return ResponseApi.success(response.data);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Get Book By ID API Error:", error);
        }
        return ResponseApi.error(
            API_MESSAGE.SYSTEM_TRY_AGAIN,
            HttpStatusCode.BadRequest
        );
    }
}
