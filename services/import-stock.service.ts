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
  code: string;
  supplierId: number;
  supplierName: string;
  createdById: number;
  createdByName: string;
  purchaseOrderId: number;
  importDate: string;
  status: string;
  totalAmount: number;
  items: ImportStockItem[];
}

export interface ImportStockItem {
  id: number;
  bookId: number;
  bookTitle: string;
  variantId: number;
  variantFormat: string;
  quantity: number;
  importPrice: number;
  totalPrice: number;
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
  return getResponseData(response) ?? [];
}

export const importStockService = {
  createFromPO: createImportStockFromPOSafe,
  getAll: getImportStocksSafe,
};
