import type { Category } from "@/types/response/category.response";
import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface CreateCategoryRequest {
  name: string;
  code?: string;
  description?: string;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Category[]>>("/api/categories");
      const categoriesData = getResponseData<Category[]>(response);
      return categoriesData ?? [];
    } catch {
      return [];
    }
  },

  async getCategoryById(categoryId: number | string): Promise<Category> {
    const response = await http.get<ApiResponseEnvelope<Category>>(`/api/categories/${categoryId}`);
    return requireResponseData(response, "Category not found");
  },

  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const response = await http.post<ApiResponseEnvelope<Category>>("/api/categories", payload);
    return requireResponseData(response, "Create category response is missing data");
  },

  async updateCategory(
    categoryId: number | string,
    payload: UpdateCategoryRequest,
  ): Promise<Category> {
    const response = await http.put<ApiResponseEnvelope<Category>>(`/api/categories/${categoryId}`, payload);
    return requireResponseData(response, "Update category response is missing data");
  },

  async deleteCategory(categoryId: number | string): Promise<void> {
    await http.del<ApiResponseEnvelope<null>>(`/api/categories/${categoryId}`);
  },
};
