import { useQuery, useMutation, queryOptions } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};

export const categoryOptions = {
  all: () =>
    queryOptions({
      queryKey: categoryKeys.lists(),
      queryFn: () => categoryService.getCategoriesSafe(),
    }),
};

export const useCategories = () => {
  return useQuery(categoryOptions.all());
};

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: (payload: { name: string; code?: string; description?: string }) =>
      categoryService.createCategory(payload),
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: number | string; payload: { name?: string; code?: string; description?: string } }) =>
      categoryService.updateCategory(categoryId, payload),
  });
};

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationFn: (categoryId: number | string) => categoryService.deleteCategory(categoryId),
  });
};
