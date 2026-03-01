import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

type BatchResult = {
  batchId: number;
  batchCode: string;
  bookId: number;
  bookTitle: string;
  variantId: number;
  variantName: string;
  quantity: number;
  importPrice: number;
  isNew: boolean;
};

type ReceiveImportStockResponse = {
  importStockId: number;
  received: boolean;
  batchResults: BatchResult[];
};

export async function POST(
  request: NextRequest
) {
  try {
    const headers = getAuthorizationHeader(request);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Extract importStockId from URL path
    const pathParts = request.url.split('/');
    const importStockId = pathParts[pathParts.length - 2];
    
    if (!importStockId || isNaN(parseInt(importStockId))) {
      return NextResponse.json(
        { error: "Invalid import stock ID", message: "ID phiếu nhập không hợp lệ", statusCode: 400, success: false },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required", message: "Thiếu userId", statusCode: 400, success: false },
        { status: 400 }
      );
    }

    const response = await api.post<ReceiveImportStockResponse>(
      `import-stocks/${importStockId}/receive?userId=${userId}`,
      {},
      { headers }
    );

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Receive Import Stock API Error");
  }
}
