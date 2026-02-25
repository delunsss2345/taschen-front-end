// Request body cho API PUT /api/books/{bookId}
export type UpdateBookInfoRequest = {
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
  categoryIds: number[];
  variantIds: number[];
  supplierId: number;
};

// Request body cho API PUT /api/book-variants/{variantId}
export type UpdateVariantRequest = {
  price: number;
  stockQuantity: number;
};

// CreateBookRequest (giữ nguyên nếu cần)
export type CreateBookRequest = {
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
  categoryIds: number[];
  variantIds: number[];
  supplierId?: number;
};
