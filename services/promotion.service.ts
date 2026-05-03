import { http } from "@/utils/http";
import { getResponseData, type ApiResponseEnvelope } from "./helpers/response";
import type {
  Promotion,
  CreatePromotionRequest,
  PromotionSearchParams,
} from "@/types/response/promotion.response";

export type { Promotion };
export type CreatePromotionData = CreatePromotionRequest;

export const promotionService = {
  async getAll(): Promise<Promotion[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Promotion[]>>("promotions");
      return getResponseData<Promotion[]>(response) ?? [];
    } catch {
      return [];
    }
  },

  async getAllPromotions(): Promise<Promotion[]> {
    return promotionService.getAll();
  },

  async search(params: PromotionSearchParams = {}): Promise<Promotion[]> {
    try {
      const query = new URLSearchParams();
      if (params.name) query.set("name", params.name);
      if (params.code) query.set("code", params.code);
      if (params.status) query.set("status", params.status);
      if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
      const qs = query.toString();
      const response = await http.get<ApiResponseEnvelope<Promotion[]>>(
        `promotions/search${qs ? `?${qs}` : ""}`,
      );
      return getResponseData<Promotion[]>(response) ?? [];
    } catch {
      return [];
    }
  },

  async getById(id: number): Promise<Promotion | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<Promotion>>(`promotions/${id}`);
      return getResponseData<Promotion>(response);
    } catch {
      return null;
    }
  },

  async getPromotionById(id: number): Promise<Promotion | null> {
    return promotionService.getById(id);
  },

  async create(data: CreatePromotionRequest): Promise<Promotion> {
    const response = await http.post<ApiResponseEnvelope<Promotion>>("promotions", data);
    const result = getResponseData<Promotion>(response);
    if (!result) throw new Error("Tạo khuyến mãi thất bại");
    return result;
  },

  async createPromotion(data: CreatePromotionData): Promise<Promotion> {
    return promotionService.create(data);
  },

  async validate(code: string): Promise<{ isValid: boolean; promotion?: Promotion }> {
    try {
      const validateRes = await http.get<ApiResponseEnvelope<{ isValid: boolean }>>(
        `promotions/validate/${encodeURIComponent(code)}`,
      );
      const validateData = getResponseData<{ isValid: boolean }>(validateRes);
      if (!validateData?.isValid) return { isValid: false };

      const promotions = await promotionService.search({ code });
      const promotion = promotions.find(
        (p) => p.code.toLowerCase() === code.toLowerCase(),
      );
      return { isValid: true, promotion };
    } catch {
      return { isValid: false };
    }
  },

  async approve(id: number): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${id}/approve`,
      {},
    );
    const result = getResponseData<Promotion>(response);
    if (!result) throw new Error("Duyệt khuyến mãi thất bại");
    return result;
  },

  async approvePromotion(id: number): Promise<Promotion> {
    return promotionService.approve(id);
  },

  async deactivate(id: number): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${id}/deactivate`,
      {},
    );
    const result = getResponseData<Promotion>(response);
    if (!result) throw new Error("Vô hiệu hóa thất bại");
    return result;
  },

  async rejectPromotion(id: number): Promise<Promotion> {
    return promotionService.deactivate(id);
  },

  async pause(id: number): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${id}/pause`,
      {},
    );
    const result = getResponseData<Promotion>(response);
    if (!result) throw new Error("Tạm dừng thất bại");
    return result;
  },

  async pausePromotion(id: number): Promise<Promotion> {
    return promotionService.pause(id);
  },

  async resume(id: number): Promise<Promotion> {
    const response = await http.patch<ApiResponseEnvelope<Promotion>>(
      `promotions/${id}/resume`,
      {},
    );
    const result = getResponseData<Promotion>(response);
    if (!result) throw new Error("Tiếp tục thất bại");
    return result;
  },

  async resumePromotion(id: number): Promise<Promotion> {
    return promotionService.resume(id);
  },
};
