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

export interface CreateReturnRequestPayload {
  orderId: number;
  reason: string;
}

async function getReturnRequestsSafe(): Promise<ReturnRequest[]> {
  const response = await http.get<ApiResponseEnvelope<ReturnRequest[]>>(
    "return-requests"
  );
  return getResponseData(response) ?? [];
}

async function getMyReturnRequests(): Promise<ReturnRequest[]> {
  try {
    const response = await http.get<ApiResponseEnvelope<ReturnRequest[]>>(
      "return-requests/my-requests"
    );
    return getResponseData(response) ?? [];
  } catch {
    return [];
  }
}

async function createReturnRequest(payload: CreateReturnRequestPayload): Promise<ReturnRequest> {
  const response = await http.post<ApiResponseEnvelope<ReturnRequest>>(
    "return-requests",
    payload,
  );
  return requireResponseData(response, "Tạo yêu cầu hoàn trả thất bại");
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
  getMyRequests: getMyReturnRequests,
  create: createReturnRequest,
  approve: approveReturnRequest,
  reject: rejectReturnRequest,
};
