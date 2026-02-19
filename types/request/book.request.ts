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
  variantFormats: string[];
};

export type UpdateBookRequest = CreateBookRequest;
