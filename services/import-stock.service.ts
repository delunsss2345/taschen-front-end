import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface ImportStockFilter {
  purchaseOrderId?: number;
}

export interface CreateImportStockFromPORequest {
  supplierId: number;
  createdById: number;
  purchaseOrderId: number;
  details?: Array<{
    bookId: number;
    variantId: number | null;
    quantity: number;
    importPrice: number;
    supplierId: number;
  }>;
}

export interface ImportStock {
  id: number;
  code?: string;
  supplierId: number;
  supplierName: string;
  createdById: number;
  createdByName: string;
  purchaseOrderId: number;
  importDate: string;
  received: boolean;
  status?: string;
  totalAmount?: number;
  details?: ImportStockItem[];
  items?: ImportStockItem[];
}

export interface ImportStockItem {
  id: number;
  bookId: number;
  bookTitle: string;
  variantId: number;
  variantFormat?: string;
  variantName?: string;
  quantity: number;
  importPrice: number;
  totalPrice: number;
}

export interface BatchResult {
  batchId: number;
  batchCode: string;
  bookId: number;
  bookTitle: string;
  variantId: number;
  variantName: string;
  quantity: number;
  importPrice: number;
  isNew: boolean;
}

export interface ReceiveImportStockResponse {
  importStockId: number;
  received: boolean;
  batchResults: BatchResult[];
}

async function createImportStockFromPOSafe(
  payload: CreateImportStockFromPORequest
): Promise<ImportStock> {
  const response = await http.post<ApiResponseEnvelope<ImportStock>>(
    "import-stocks",
    payload
  );
  return requireResponseData(
    response,
    "Create import stock response is missing data"
  );
}

async function getImportStocksSafe(filter?: ImportStockFilter): Promise<ImportStock[]> {
  let url = "import-stocks";
  if (filter?.purchaseOrderId) {
    url += `?purchaseOrderId=${filter.purchaseOrderId}`;
  }
  const response = await http.get<ApiResponseEnvelope<ImportStock[]>>(url);
  const data = getResponseData(response) ?? [];
  // Map details to items for compatibility
  return data.map(stock => ({
    ...stock,
    items: stock.items || stock.details || []
  }));
}

async function receiveImportStockSafe(
  importStockId: number,
  userId: number
): Promise<ReceiveImportStockResponse> {
  const response = await http.post<ApiResponseEnvelope<ReceiveImportStockResponse>>(
    `import-stocks/${importStockId}/receive?userId=${userId}`,
    {}
  );
  return requireResponseData(
    response,
    "Receive import stock response is missing data"
  );
}

export const importStockService = {
  createFromPO: createImportStockFromPOSafe,
  getAll: getImportStocksSafe,
  receive: receiveImportStockSafe,
};
