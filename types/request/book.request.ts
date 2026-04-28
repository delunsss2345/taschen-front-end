// Request body cho API PUT /api/books/{bookId}
export type UpdateBookInfoRequest = {
  title: string;
  author: string;
  description: string;
  publicationYear: number;
  weightGrams: number;
  pageCount: number;
  price: number;
  imageUrl: string;
  isActive: boolean;
  categoryIds: number[];
  supplierId: number;
  formatId?: number;
  variantIds?: number[];
};

// Request body cho API PUT /api/book-variants/{variantId}
export type UpdateVariantRequest = {
  price: number;
  stockQuantity: number;
};

export type CreateBookRequest = {
  title: string;
  price: number;
  author?: string;
  description?: string;
  publicationYear?: number;
  weightGrams?: number;
  pageCount?: number;
  imageUrl?: string;
  isActive?: boolean;
  categoryIds?: number[];
  variantIds?: number[];
  supplierId?: number;
};
