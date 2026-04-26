import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface ReturnRequestItem {
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  orderTotal: number;
  reason: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  createdById: number;
  createdByName: string;
  processedById: number | null;
  processedByName: string | null;
  responseNote: string | null;
  items: ReturnRequestItem[];
}

async function getReturnRequestsSafe(): Promise<ReturnRequest[]> {
  const response = await http.get<ApiResponseEnvelope<ReturnRequest[]>>(
    "return-requests"
  );
  return getResponseData(response) ?? [];
}

async function approveReturnRequest(returnId: number, responseNote: string): Promise<ReturnRequest> {
  const response = await http.put<ApiResponseEnvelope<ReturnRequest>>(
    `return-requests/${returnId}/approve`,
    { responseNote }
  );
  return requireResponseData(response);
}

async function rejectReturnRequest(returnId: number, responseNote: string): Promise<ReturnRequest> {
  const response = await http.put<ApiResponseEnvelope<ReturnRequest>>(
    `return-requests/${returnId}/reject`,
    { responseNote }
  );
  return requireResponseData(response);
}

export const returnRequestService = {
  getAll: getReturnRequestsSafe,
  approve: approveReturnRequest,
  reject: rejectReturnRequest,
};
