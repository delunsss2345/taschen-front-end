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
  variantFormats: string[];
  categoryIds: number[];
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
