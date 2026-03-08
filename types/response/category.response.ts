import { BaseResponse } from "./base.response";

export interface Category {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export type CategoryApiResponse = BaseResponse<Category>;

export type CategoryResponseWrapper = {
  success: boolean;
  data: CategoryApiResponse;
};

export type CategoriesApiResponse = BaseResponse<Category[]>;

export type CategoriesResponseWrapper = {
  success: boolean;
  data: CategoriesApiResponse;
};
