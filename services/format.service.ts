import type { Format } from "@/types/response/format.response";
import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface CreateFormatRequest {
  formatCode: string;
  formatName: string;
}

export type UpdateFormatRequest = Partial<CreateFormatRequest>;

export const formatService = {
  async getAllFormats(): Promise<Format[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Format[]>>("variants");
      const formatsData = getResponseData<Format[]>(response);
      return formatsData ?? [];
    } catch {
      return [];
    }
  },

  async getFormatById(formatId: number | string): Promise<Format> {
    const response = await http.get<ApiResponseEnvelope<Format>>(`variants/${formatId}`);
    return requireResponseData(response, "Format not found");
  },

  async createFormat(payload: CreateFormatRequest): Promise<Format> {
    const response = await http.post<ApiResponseEnvelope<Format>>("variants", payload);
    return requireResponseData(response, "Create format response is missing data");
  },

  async updateFormat(
    formatId: number | string,
    payload: UpdateFormatRequest,
  ): Promise<Format> {
    const response = await http.put<ApiResponseEnvelope<Format>>(`variants/${formatId}`, payload);
    return requireResponseData(response, "Update format response is missing data");
  },

  async deleteFormat(formatId: number | string): Promise<void> {
    await http.del<ApiResponseEnvelope<null>>(`variants/${formatId}`);
  },
};
