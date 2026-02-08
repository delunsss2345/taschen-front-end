import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";

export async function GET() {
    try {
        const response = await api.get<any>("books")
        console.log(response.data);
        return ResponseApi.success(response.data);
    }
    catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Login API Error:", error);
        }
        return ResponseApi.error(
            API_MESSAGE.SYSTEM_TRY_AGAIN, HttpStatusCode.BadRequest
        )
    }
}