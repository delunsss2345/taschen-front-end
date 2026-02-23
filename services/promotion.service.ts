import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export type PromotionStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "DELETED"
  | "PAUSED"
  | (string & {});

export interface Promotion {
  id: number;
  name: string;
  code: string;
  discountPercent: number;
  quantity: number;
  priceOrderActive: number | null;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  isActive: boolean;
  createdById: number;
  createdByName: string;
  approvedById: number | null;
  approvedByName: string | null;
}

export interface CreatePromotionData {
  name: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  quantity: number;
  priceOrderActive: number | null;
}

export const promotionService = {
  async getAllPromotions(): Promise<Promotion[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Promotion[]>>("promotions");
      const promotionsData = getResponseData<Promotion[]>(response);
      return promotionsData ?? [];
    } catch {
      return [];
    }
  },

  async getPromotionById(promotionId: number | string): Promise<Promotion> {
    const response = await http.get<ApiResponseEnvelope<Promotion>>(`promotions/${promotionId}`);
    return requireResponseData(response, "Promotion not found");
  },

  async createPromotion(data: CreatePromotionData): Promise<Promotion> {
    const response = await http.post<ApiResponseEnvelope<Promotion>>("promotions", data);
    return requireResponseData(response, "Create promotion response is missing data");
  },

  async rejectPromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${promotionId}/deactivate`,
      {},
    );
    return requireResponseData(response, "Reject promotion response is missing data");
  },

  async approvePromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${promotionId}/approve`,
      {},
    );
    return requireResponseData(response, "Approve promotion response is missing data");
  },

  async pausePromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${promotionId}/pause`,
      {},
    );
    return requireResponseData(response, "Pause promotion response is missing data");
  },

  async resumePromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${promotionId}/resume`,
      {},
    );
    return requireResponseData(response, "Resume promotion response is missing data");
  },
};
