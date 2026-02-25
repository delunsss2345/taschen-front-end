import type { BackendApiResponse } from "@/types/response/book.response";
import type { UpdateVariantRequest } from "@/types/request/book.request";
import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export type BookVariant = {
  id: number;
  bookId: number;
  variantId: number;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  variant?: {
    id: number;
    formatCode: string;
    formatName: string;
  };
};

export type BookVariantListResponse = BookVariant[];

export const bookVariantService = {
  async getVariantsByBookId(bookId: number | string): Promise<BookVariant[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<BookVariantListResponse>>(
        `book-variants/book/${bookId}`
      );
      const data = getResponseData<BookVariant[]>(response);
      return data ?? [];
    } catch {
      return [];
    }
  },

  async getVariantById(variantId: number | string): Promise<BookVariant> {
    const response = await http.get<ApiResponseEnvelope<BookVariant>>(
      `book-variants/${variantId}`
    );
    return getResponseData<BookVariant>(response) as BookVariant;
  },

  async updateVariant(variantId: number | string, payload: UpdateVariantRequest): Promise<BookVariant> {
    const response = await http.put<ApiResponseEnvelope<BookVariant>>(
      `book-variants/${variantId}`,
      payload
    );
    return requireResponseData(response, "Update variant response is missing data");
  },
};
