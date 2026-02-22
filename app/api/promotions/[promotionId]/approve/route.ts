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

type PromotionApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: Promotion;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ promotionId: string }> }
) {
  try {
    const { promotionId } = await params;
    const headers = getAuthorizationHeader(request);
    
    const response = await api.patch<PromotionApiResponse>(`api/promotions/${promotionId}/approve`, undefined, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Approve Promotion API Error");
  }
}
