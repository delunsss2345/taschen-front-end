import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface StockRequest {
  id: number;
  quantity: number;
  reason: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  responseMessage: string | null;
  bookId: number;
  bookTitle: string;
  variantId: number | null;
  variantName: string | null;
  createdById: number;
  createdByName: string;
  processedById: number | null;
  processedByName: string | null;
}

async function getStockRequestsSafe(): Promise<StockRequest[]> {
  const response = await http.get<ApiResponseEnvelope<StockRequest[]>>(
    "stock-requests"
  );
  return getResponseData(response) ?? [];
}

async function approveStockRequest(requestId: number, processedById: number, responseMessage: string): Promise<StockRequest> {
  const response = await http.put<ApiResponseEnvelope<StockRequest>>(
    `stock-requests/${requestId}/approve`,
    { processedById, responseMessage }
  );
  return requireResponseData(response);
}

async function rejectStockRequest(requestId: number, processedById: number, responseMessage: string): Promise<StockRequest> {
  const response = await http.put<ApiResponseEnvelope<StockRequest>>(
    `stock-requests/${requestId}/reject`,
    { processedById, responseMessage }
  );
  return requireResponseData(response);
}

async function createStockRequest(payload: {
  bookId: number;
  quantity: number;
  reason: string;
  createdById: number;
  variantId?: number;
}): Promise<StockRequest> {
  const response = await http.post<ApiResponseEnvelope<StockRequest>>(
    "stock-requests",
    payload
  );
  return requireResponseData(response);
}

export const stockRequestService = {
  getAll: getStockRequestsSafe,
  approve: approveStockRequest,
  reject: rejectStockRequest,
  create: createStockRequest,
};
