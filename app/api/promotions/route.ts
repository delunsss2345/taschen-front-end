import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type Promotion = {
  id: number;
  name: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  quantity: number;
  isActive: boolean;
  status: string;
  priceOrderActive: number | null;
  createdById: number;
  createdByName: string;
  approvedById: number | null;
  approvedByName: string | null;
};

type PromotionsApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: Promotion[];
};

type CreatePromotionRequest = {
  name: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  quantity: number;
  priceOrderActive: number | null;
};

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<PromotionsApiResponse>("api/promotions", { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Promotions API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body: CreatePromotionRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.code || !body.discountPercent || !body.startDate || !body.endDate || !body.quantity) {
      return ResponseApi.error("Vui lòng điền đầy đủ thông tin", HttpStatusCode.BadRequest);
    }

    const response = await api.post<{ data: Promotion }>("api/promotions", body, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create Promotion API Error");
  }
}
