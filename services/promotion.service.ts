import http from "@/utils/http";

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

function extractData<T>(response: { data?: unknown }): T | null {
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    const innerData = (response.data as { data: unknown }).data;
    if (innerData && typeof innerData === 'object' && 'data' in innerData) {
      return (innerData as { data: T }).data;
    }
    return innerData as T;
  }

  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return (response.data as { data: T }).data;
  }
  return response.data as T;
}

export const promotionService = {
  async getAllPromotions(): Promise<Promotion[]> {
    try {
      const response = await http.get("/api/promotions");
      const promotionsData = extractData<Promotion[]>(response);
      return Array.isArray(promotionsData) ? promotionsData : [];
    } catch {
      return [];
    }
  },

  async getPromotionById(promotionId: number | string): Promise<Promotion> {
    const response = await http.get(`/api/promotions/${promotionId}`);
    const data = extractData<Promotion>(response);
    return data as Promotion;
  },

  async createPromotion(data: CreatePromotionData): Promise<Promotion> {
    const response = await http.post("/api/promotions", data);
    const result = extractData<Promotion>(response);
    return result as Promotion;
  },

  async rejectPromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch(`/api/promotions/${promotionId}/deactivate`);
    const result = extractData<Promotion>(response);
    return result as Promotion;
  },

  async approvePromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch(`/api/promotions/${promotionId}/approve`);
    const result = extractData<Promotion>(response);
    return result as Promotion;
  },

  async pausePromotion(promotionId: number | string): Promise<Promotion> {
    const response = await http.patch(`/api/promotions/${promotionId}/pause`);
    const result = extractData<Promotion>(response);
    return result as Promotion;
  },
};
