import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface Batch {
  id: number;
  batchCode: string;
  quantity: number;
  remainingQuantity: number;
  importPrice: number;
  sellingPrice: number;
  productionDate: string;
  createdAt: string;
  bookId: number;
  bookTitle: string;
  createdById: number;
  createdByName: string;
  supplierId: number;
  supplierName: string;
  importStockDetailId: number | null;
  variant?: {
    id: number;
    formatName: string;
    formatCode: string;
  } | null;
}

export interface CreateBatchRequest {
  bookId: number;
  variantId?: number | null;
  createdById: number;
  quantity: number;
  importPrice: number;
  sellingPrice?: number | null;
  productionDate: string;
  supplierId: number;
}

export const batchService = {
  async getAllBatches(): Promise<Batch[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Batch[]>>("/batches");
      const batchesData = getResponseData<Batch[]>(response);
      return batchesData ?? [];
    } catch {
      return [];
    }
  },

  async getBatchById(batchId: number | string): Promise<Batch | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<Batch>>(`/batches/${batchId}`);
      const data = getResponseData<Batch>(response);
      return data ?? null;
    } catch {
      return null;
    }
  },

  async createBatch(payload: CreateBatchRequest): Promise<Batch> {
    const response = await http.post<ApiResponseEnvelope<Batch>>("/batches", payload);
    return requireResponseData(response, "Create batch response is missing data");
  },
};
