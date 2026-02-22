import type {
  CreateBookRequest,
  UpdateBookRequest,
} from "@/types/request/book.request";
import type {
  Book,
  BookListData,
} from "@/types/response/book.response";
import type { Category } from "@/types/response/category.response";
import { http } from "@/utils/http";
import { categoryService } from "./category.service";

function extractData<T>(response: { data?: unknown }): T | null {
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    const innerData = (response.data as { data: unknown }).data;
    if (innerData && typeof innerData === 'object' && 'data' in innerData) {
      return (innerData as { data: T }).data;
    }
    return innerData as T;
  }
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return (response.data as { data: T }).data;
  }
  return response.data as T;
}

// Helper for list responses with pagination
function extractListData<T>(response: { data?: unknown }): { data: T[]; meta?: unknown } {
  const extracted = extractData<{ result: T[]; meta?: unknown }>(response);
  if (extracted) {
    return { data: extracted.result || [], meta: extracted.meta };
  }
  const arrayData = extractData<T[]>(response);
  if (arrayData) {
    return { data: arrayData };
  }
  return { data: [] };
}

export const bookService = {
  async getAllBooks(params?: { page?: number; pageSize?: number }): Promise<BookListData> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString())
    
    const queryString = queryParams.toString()
    const url = queryString ? `/api/books?${queryString}` : '/api/books'
    
    const response = await http.get(url);
    const { data: booksResult, meta } = extractListData<Book>(response);
    
    if (!Array.isArray(booksResult)) {
      return {
        result: [],
        meta: { page: 1, pageSize: 10, total: 0, pages: 0 }
      };
    }

    let categories: Category[] = [];
    try {
      categories = await categoryService.getAllCategories();
    } catch {
      // Error fetching categories is non-critical
    }
    
    const categoryList = Array.isArray(categories) ? categories : [];
    
    const booksWithCategories = booksResult.map((book: Book) => ({
      ...book,
      categories: book.categoryIds && book.categoryIds.length > 0
        ? (book.categoryIds
            .map((id: number) => categoryList.find((cat: Category) => cat.id === id) || null)
            .filter((cat: Category | null): cat is Category => cat !== null && cat !== undefined))
        : [],
    }));

    return {
      result: booksWithCategories,
      meta: (meta as BookListData['meta']) || { page: 1, pageSize: 10, total: 0, pages: 0 }
    };
  },

  async getBookById(bookId: number | string): Promise<Book> {
    const response = await http.get(`/api/books/${bookId}`);
    const book = extractData<Book>(response);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    try {
      const categories = await categoryService.getAllCategories();
      const categoryList = Array.isArray(categories) ? categories : [];
      const bookCategories = book.categoryIds && book.categoryIds.length > 0
        ? book.categoryIds
            .map((id: number) => categoryList.find((cat: Category) => cat.id === id) || null)
            .filter((cat: Category | null): cat is Category => cat !== null && cat !== undefined)
        : [];
      return { ...book, categories: bookCategories };
    } catch {
      return book;
    }
  },

  async createBook(payload: CreateBookRequest): Promise<Book> {
    const response = await http.post("/api/books", payload);
    const result = extractData<Book>(response);
    return result as Book;
  },

  async updateBook(bookId: number | string, payload: UpdateBookRequest): Promise<Book> {
    const response = await http.put(`/api/books/${bookId}`, payload);
    const result = extractData<Book>(response);
    return result as Book;
  },

  async deleteBook(bookId: number | string): Promise<null> {
    try {
      await http.delete(`/api/books/${bookId}`);
      return null;
    } catch {
      return null;
    }
  },

  async getSortedBooks(): Promise<BookListData> {
    const response = await http.get("/api/books/sorted");
    const { data: booksResult, meta } = extractListData<Book>(response);

    if (!Array.isArray(booksResult)) {
      return {
        result: [],
        meta: { page: 1, pageSize: 10, total: 0, pages: 0 }
      };
    }
    
    return {
      result: booksResult,
      meta: (meta as BookListData['meta']) || { page: 1, pageSize: 10, total: booksResult.length, pages: 1 }
    };
  },

  async getBooksByCategory(categoryId: number | string): Promise<BookListData> {
    const response = await http.get(`/api/books/category/${categoryId}`);
    const { data: booksResult, meta } = extractListData<Book>(response);

    if (!Array.isArray(booksResult)) {
      return {
        result: [],
        meta: { page: 1, pageSize: 10, total: 0, pages: 0 }
      };
    }
    
    return {
      result: booksResult,
      meta: (meta as BookListData['meta']) || { page: 1, pageSize: 10, total: booksResult.length, pages: 1 }
    };
  },
};
