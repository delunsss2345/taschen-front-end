import type { Book } from "@/types/response/book.response";
import type { Category } from "@/types/response/category.response";
import type { Supplier } from "@/types/response/supplier.response";

export function mapBookCategories(
  book: Book,
  categories: Category[],
): Category[] {
  if (!book.categoryIds || book.categoryIds.length === 0) {
    return [];
  }

  return book.categoryIds
    .map((id) => categories.find((cat) => cat.id === id) || null)
    .filter((cat): cat is Category => cat !== null && cat !== undefined);
}

export function mapBooksWithCategories(
  books: Book[],
  categories: Category[],
): Book[] {
  return books.map((book) => ({
    ...book,
    categories: mapBookCategories(book, categories),
  }));
}

export function mapBooksWithSuppliers(
  books: Book[],
  suppliers: Supplier[],
): Book[] {
  return books.map((book) => ({
    ...book,
    supplier: book.supplierId
      ? suppliers.find((s) => s.id === book.supplierId) || undefined
      : undefined,
  }));
}
