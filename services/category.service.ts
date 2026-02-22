import type { Category } from "@/types/response/category.response";
import http from "@/utils/http";

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

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await http.get("/api/categories");
      const categoriesData = extractData<Category[]>(response);
      return Array.isArray(categoriesData) ? categoriesData : [];
    } catch {
      return [];
    }
  },

  async getCategoryById(categoryId: number | string): Promise<Category> {
    const response = await http.get(`/api/categories/${categoryId}`);
    const data = extractData<Category>(response);
    return data as Category;
  },

  async createCategory(payload: { name: string; code?: string; description?: string }): Promise<Category> {
    const response = await http.post("/api/categories", payload);
    const result = extractData<Category>(response);
    return result as Category;
  },

  async updateCategory(categoryId: number | string, payload: { name?: string; code?: string; description?: string }): Promise<Category> {
    const response = await http.put(`/api/categories/${categoryId}`, payload);
    const result = extractData<Category>(response);
    return result as Category;
  },

  async deleteCategory(categoryId: number | string): Promise<void> {
    await http.delete(`/api/categories/${categoryId}`);
  },
};
