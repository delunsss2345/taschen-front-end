import type { Category } from "./category.response";
import type { Supplier } from "./supplier.response";

export type BackendApiResponse<T> = {
  error: string | null;
  message: string;
  statusCode: number;
  data: T;
};

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

export type BooksApiResponse = BackendApiResponse<BookListData>;
export type BookApiResponse = BackendApiResponse<Book>;
export type DeleteBookApiResponse = BackendApiResponse<null>;
