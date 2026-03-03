import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type PurchaseOrderItemRequest = {
  bookId: number;
  variantId?: number;
  quantity: number;
  importPrice: number;
};

type CreatePurchaseOrderRequest = {
  supplierId: number;
  createdById: number;
  note: string | null;
  items: PurchaseOrderItemRequest[];
};

type PurchaseOrder = {
  id: number;
  createdAt: string;
  approvedAt: string | null;
  note: string | null;
  cancelReason: string | null;
  status: string;
  supplierId: number;
  supplierName: string;
  createdById: number;
  createdByName: string;
  approvedById: number | null;
  approvedByName: string | null;
  items: Array<{
    id: number;
    bookId: number;
    bookTitle: string;
    variantId?: number | null;
    variantFormat?: string | null;
    quantity: number;
    importPrice: number;
  }>;
};

type PurchaseOrdersApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: PurchaseOrder[];
};

type PurchaseOrderApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: PurchaseOrder;
};

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<PurchaseOrdersApiResponse>("purchase-orders", { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Purchase Orders API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body = (await request.json()) as CreatePurchaseOrderRequest;

    const response = await api.post<PurchaseOrderApiResponse>("purchase-orders", body, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create Purchase Order API Error");
  }
}
