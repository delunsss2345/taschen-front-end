import type { Category } from "./category.response";
import type { Supplier } from "./supplier.response";
import type { BaseResponse } from "./base.response";

export type RouteSuccessResponse<T> = {
  success: true;
  data: T;
};

export type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  publicationYear: number;
  weightGrams: number;
  pageCount: number;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
  variantFormats?: {
    variantId?: number;
    formatCode: string;
    formatName: string;
    price: number;
    stockQuantity: number;
  }[];
  categoryIds: number[];
  categories?: Category[];
  supplierId?: number;
  supplier?: Supplier;
};

export type BookListMeta = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
};

export type BookListData = {
  meta: BookListMeta;
  result: Book[];
};

export type BooksApiResponse = BaseResponse<BookListData>;
export type BookApiResponse = BaseResponse<Book>;
export type DeleteBookApiResponse = BaseResponse<null>;
