import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface BatchInfo {
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
  variant?: {
    id: number;
    formatName: string;
    formatCode: string;
  } | null;
}

export interface DisposalRequestItem {
  id: number;
  batchId: number;
  quantity: number;
  batch?: BatchInfo | null;
}

export interface DisposalRequest {
  id: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  processedAt: string | null;
  responseNote: string | null;
  createdBy: {
    id: number;
    email: string;
  } | null;
  processedBy: {
    id: number;
    email: string;
  } | null;
  items: DisposalRequestItem[];
}

export interface CreateDisposalRequestRequest {
  reason: string;
  items: { batchId: number; quantity: number }[];
}

export const disposalRequestService = {
  async getAllDisposalRequests(): Promise<DisposalRequest[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<DisposalRequest[]>>(
        "disposal-requests"
      );
      const data = getResponseData<DisposalRequest[]>(response);
      return data ?? [];
    } catch {
      return [];
    }
  },

  async getDisposalRequestById(
    disposalRequestId: number | string
  ): Promise<DisposalRequest | null> {
    try {
      const id = typeof disposalRequestId === "string"
        ? Number(disposalRequestId)
        : disposalRequestId;

      const response = await http.get<ApiResponseEnvelope<DisposalRequest>>(
        `disposal-requests/${id}`
      );
      const data = getResponseData<DisposalRequest>(response);
      return data ?? null;
    } catch {
      return null;
    }
  },

  async createDisposalRequest(
    payload: CreateDisposalRequestRequest
  ): Promise<DisposalRequest> {
    const response = await http.post<ApiResponseEnvelope<DisposalRequest>>(
      "disposal-requests",
      payload
    );
    return requireResponseData(
      response,
      "Create disposal request response is missing data"
    );
  },

  async approveDisposalRequest(
    disposalRequestId: number | string,
    responseNote: string
  ): Promise<DisposalRequest> {
    const response = await http.put<ApiResponseEnvelope<DisposalRequest>>(
      `disposal-requests/${disposalRequestId}/approve`,
      { responseNote }
    );
    return requireResponseData(
      response,
      "Approve disposal request response is missing data"
    );
  },

  async rejectDisposalRequest(
    disposalRequestId: number | string,
    responseNote: string
  ): Promise<DisposalRequest> {
    const response = await http.put<ApiResponseEnvelope<DisposalRequest>>(
      `disposal-requests/${disposalRequestId}/reject`,
      { responseNote }
    );
    return requireResponseData(
      response,
      "Reject disposal request response is missing data"
    );
  },
};
