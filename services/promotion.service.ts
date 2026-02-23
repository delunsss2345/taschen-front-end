import { http } from "@/utils/http";
import { getResponseData } from "./helpers/response";

export interface Promotion {
  id: number;
  name: string;
  code: string;
  discountPercent: number;
  quantity: number;
  priceOrderActive: number | null;
  startDate: string;
  endDate: string;
  status: string;
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
      const response = await http.get("/api/promotions");
      const promotionsData = getResponseData<Promotion[]>(response);
      return promotionsData ?? [];
    } catch {
      return [];
    }
  },

  async getPromotionById(promotionId: number | string): Promise<Promotion> {
    const response = await http.get(`/api/promotions/${promotionId}`);
    const data = getResponseData<Promotion>(response);
    return data as Promotion;
  },

  async createPromotion(data: CreatePromotionData): Promise<Promotion> {
    const response = await http.post("/api/promotions", data);
    const result = getResponseData<Promotion>(response);
    return result as Promotion;
  },

  async rejectPromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch(`/api/promotions/${promotionId}/deactivate`, {});
    const result = getResponseData<Promotion>(response);
    return result as Promotion;
  },

  async approvePromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch(`/api/promotions/${promotionId}/approve`, {});
    const result = getResponseData<Promotion>(response);
    return result as Promotion;
  },

  async pausePromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch(`/api/promotions/${promotionId}/pause`, {});
    const result = getResponseData<Promotion>(response);
    return result as Promotion;
  },
};
