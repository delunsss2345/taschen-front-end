import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type CreatePurchaseOrderFromStockRequestBody = {
  stockRequestId: number;
  supplierId: number;
  createdById: number;
  importPrice: number;
  note?: string;
};

type PurchaseOrderItem = {
  id: number;
  bookId: number;
  bookTitle: string;
  variantId?: number | null;
  variantName: string;
  quantity: number;
  importPrice: number;
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
  purchaseOrderItems: PurchaseOrderItem[];
};

type PurchaseOrderApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: PurchaseOrder;
};

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body = (await request.json()) as CreatePurchaseOrderFromStockRequestBody;

    // Validate required fields
    if (!body.stockRequestId || !body.supplierId || !body.createdById || !body.importPrice) {
      return ResponseApi.error(
        "Thiếu thông tin bắt buộc",
        HttpStatusCode.BadRequest
      );
    }

    if (body.importPrice <= 0) {
      return ResponseApi.error(
        "Giá nhập phải lớn hơn 0",
        HttpStatusCode.BadRequest
      );
    }

    const response = await api.post<PurchaseOrderApiResponse>(
      "purchase-orders/from-stock-request",
      body,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(
      error,
      API_MESSAGE.SYSTEM_TRY_AGAIN,
      "Create Purchase Order From Stock Request API Error"
    );
  }
}
