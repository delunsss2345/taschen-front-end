import type { Category } from "@/types/response/category.response";
import http from "@/utils/http";
import { getResponseData } from "./helpers/response";

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await http.get("/api/categories");
      const categoriesData = getResponseData<Category[]>(response);
      return categoriesData ?? [];
    } catch {
      return [];
    }
  },

  async getCategoryById(categoryId: number | string): Promise<Category> {
    const response = await http.get(`/api/categories/${categoryId}`);
    const data = getResponseData<Category>(response);
    return data as Category;
  },

  async createCategory(payload: { name: string; code?: string; description?: string }): Promise<Category> {
    const response = await http.post("/api/categories", payload);
    const result = getResponseData<Category>(response);
    return result as Category;
  },

  async updateCategory(categoryId: number | string, payload: { name?: string; code?: string; description?: string }): Promise<Category> {
    const response = await http.put(`/api/categories/${categoryId}`, payload);
    const result = getResponseData<Category>(response);
    return result as Category;
  },

  async deleteCategory(categoryId: number | string): Promise<void> {
    await http.delete(`/api/categories/${categoryId}`);
  },
};
