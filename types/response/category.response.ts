export interface Category {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export type CategoryApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: Category;
};

export type CategoryResponseWrapper = {
  success: boolean;
  data: CategoryApiResponse;
};
export type CategoriesApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: Category[];
};

export type CategoriesResponseWrapper = {
  success: boolean;
  data: CategoriesApiResponse;
};
