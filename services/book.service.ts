import type {
  CreateBookRequest,
  UpdateBookRequest,
} from "@/types/request/book.request";
import type {
  Book,
  BookListData,
  BookListMeta,
} from "@/types/response/book.response";
import type { Category } from "@/types/response/category.response";
import { http } from "@/utils/http";
import { categoryService } from "./category.service";
import {
  getListData,
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export const bookService = {
  async getAllBooks(params?: { page?: number; pageSize?: number }): Promise<BookListData> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/api/books?${queryString}` : '/api/books';

    const response = await http.get<ApiResponseEnvelope<BookListData>>(url);
    const { data: booksResult, meta } = getListData<Book, BookListMeta>(response);

    const categories = await getCategoriesSafe();
    const booksWithCategories = mapBooksWithCategories(booksResult, categories);

    return {
      result: booksWithCategories,
      meta: meta ?? { page: 1, pageSize: 10, total: 0, pages: 0 }
    };
  },

  async getBookById(bookId: number | string): Promise<Book> {
    const response = await http.get<ApiResponseEnvelope<Book>>(`/api/books/${bookId}`);
    const book = getResponseData<Book>(response);

    if (!book) {
      throw new Error('Book not found');
    }

    try {
      const categories = await getCategoriesSafe();
      const bookCategories = mapBookCategories(book, categories);
      return { ...book, categories: bookCategories };
    } catch {
      return book;
    }
  },

  async createBook(payload: CreateBookRequest): Promise<Book> {
    const response = await http.post<ApiResponseEnvelope<Book>>("/api/books", payload);
    return requireResponseData(response, "Create book response is missing data");
  },

  async updateBook(bookId: number | string, payload: UpdateBookRequest): Promise<Book> {
    const response = await http.put<ApiResponseEnvelope<Book>>(`/api/books/${bookId}`, payload);
    return requireResponseData(response, "Update book response is missing data");
  },

  async deleteBook(bookId: number | string): Promise<null> {
    try {
      await http.del<ApiResponseEnvelope<null>>(`/api/books/${bookId}`);
      return null;
    } catch {
      return null;
    }
  },

  async getSortedBooks(): Promise<BookListData> {
    const response = await http.get<ApiResponseEnvelope<BookListData | Book[]>>("/api/books/sorted");
    const { data: booksResult, meta } = getListData<Book, BookListMeta>(response);

    return {
      result: booksResult,
      meta: meta ?? { page: 1, pageSize: 10, total: booksResult.length, pages: 1 }
    };
  },

  async getBooksByCategory(categoryId: number | string): Promise<BookListData> {
    const response = await http.get<ApiResponseEnvelope<BookListData | Book[]>>(
      `/api/books/category/${categoryId}`,
    );
    const { data: booksResult, meta } = getListData<Book, BookListMeta>(response);

    return {
      result: booksResult,
      meta: meta ?? { page: 1, pageSize: 10, total: booksResult.length, pages: 1 }
    };
  },
};

async function getCategoriesSafe(): Promise<Category[]> {
  try {
    const categories = await categoryService.getAllCategories();
    return Array.isArray(categories) ? categories : [];
  } catch {
    return [];
  }
}

function mapBooksWithCategories(books: Book[], categories: Category[]): Book[] {
  return books.map(book => ({
    ...book,
    categories: mapBookCategories(book, categories)
  }));
}

function mapBookCategories(book: Book, categories: Category[]): Category[] {
  if (!book.categoryIds || book.categoryIds.length === 0) {
    return [];
  }

  return book.categoryIds
    .map(id => categories.find(cat => cat.id === id) || null)
    .filter((cat): cat is Category => cat !== null && cat !== undefined);
}
