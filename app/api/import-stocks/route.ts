import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type ImportStockDetail = {
  bookId: number;
  variantId: number | null;
  quantity: number;
  importPrice: number;
  supplierId: number;
};

type CreateImportStockRequest = {
  supplierId: number;
  createdById: number;
  purchaseOrderId: number;
  details: ImportStockDetail[];
};

type ImportStockItem = {
  id: number;
  bookId: number;
  bookTitle: string;
  variantId: number;
  variantFormat: string;
  quantity: number;
  importPrice: number;
  totalPrice: number;
};

type ImportStock = {
  id: number;
  code: string;
  importDate: string;
  received: boolean;
  supplierId: number;
  supplierName: string;
  purchaseOrderId: number;
  createdById: number;
  createdByName: string;
  status: string;
  totalAmount: number;
  items: ImportStockItem[];
};

type ImportStockApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: ImportStock;
};

type ImportStocksApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: ImportStock[];
};

export async function POST(
  request: NextRequest
) {
  try {
    const headers = getAuthorizationHeader(request);
    const body: CreateImportStockRequest = await request.json();

    const response = await api.post<ImportStockApiResponse>(
      "import-stocks",
      body,
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create Import Stock From PO API Error");
  }
}

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const { searchParams } = new URL(request.url);
    const purchaseOrderId = searchParams.get("purchaseOrderId");

    let url = "import-stocks";
    if (purchaseOrderId) {
      url += `?purchaseOrderId=${purchaseOrderId}`;
    }

    const response = await api.get<ImportStocksApiResponse>(url, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Import Stocks API Error");
  }
}
