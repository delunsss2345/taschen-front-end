import type { Category, CategoryResponseWrapper } from "@/types/response/category.response";
import { http } from "@/utils/http";

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await http.get("/api/categories");
      const categoriesData = response.data;
      return Array.isArray(categoriesData) ? categoriesData : [];
    } catch (error) {
      return [];
    }
  },

  async getCategoryById(categoryId: number | string): Promise<Category> {
    const response = await http.get<CategoryResponseWrapper>(`/api/categories/${categoryId}`);
    return response.data.data;
  },

  async createCategory(payload: { name: string; code?: string; description?: string }): Promise<Category> {
    const response = await http.post<CategoryResponseWrapper>("/api/categories", payload);
    return response.data.data;
  },

  async updateCategory(categoryId: number | string, payload: { name?: string; code?: string; description?: string }): Promise<Category> {
    const response = await http.put<CategoryResponseWrapper>(`/api/categories/${categoryId}`, payload);
    return response.data.data;
  },

  async deleteCategory(categoryId: number | string): Promise<void> {
    await http.del(`/api/categories/${categoryId}`);
  },
};
