export interface Book {
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
}

export interface BooksApiResponse {
    error: null | string;
    message: string;
    statusCode: number;
    data: Book[];
}
