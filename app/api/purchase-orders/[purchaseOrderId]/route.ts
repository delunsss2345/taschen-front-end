import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

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
    quantity: number;
    importPrice: number;
  }>;
};

type PurchaseOrderApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: PurchaseOrder;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseOrderId: string }> }
) {
  try {
    const { purchaseOrderId } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.get<PurchaseOrderApiResponse>(`purchase-orders/${purchaseOrderId}`, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Purchase Order API Error");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseOrderId: string }> }
) {
  try {
    const { purchaseOrderId } = await params;
    const headers = getAuthorizationHeader(request);
    const body = await request.json();
    const { action } = body;

    let response;
    switch (action) {
      case 'approve':
        response = await api.put<{ data: PurchaseOrder }>(`purchase-orders/${purchaseOrderId}/approve`, {}, { headers });
        break;
      case 'reject':
        response = await api.put<{ data: PurchaseOrder }>(`purchase-orders/${purchaseOrderId}/reject`, {}, { headers });
        break;
      case 'cancel':
        response = await api.put<{ data: PurchaseOrder }>(`purchase-orders/${purchaseOrderId}/cancel`, { reason: body.reason }, { headers });
        break;
      default:
        return ResponseApi.error("Hành động không hợp lệ", HttpStatusCode.BadRequest);
    }

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Update Purchase Order API Error");
  }
}
