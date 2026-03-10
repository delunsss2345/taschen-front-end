import { useQuery, queryOptions } from "@tanstack/react-query";
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
