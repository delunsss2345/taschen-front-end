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

export const bookService = {
  async getAllBooks(params?: { page?: number; pageSize?: number }): Promise<BookListData> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString())
    
    const queryString = queryParams.toString()
    const url = queryString ? `/api/books?${queryString}` : '/api/books'
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await http.get(url) as any;

    const booksData = response.data;
    const booksResult = booksData?.result;
    
    if (!booksResult || !Array.isArray(booksResult)) {
      return {
        result: [],
        meta: booksData?.meta || { page: 1, pageSize: 10, total: 0, pages: 0 }
      };
    }

    let categories: Category[] = [];
    try {
      categories = await categoryService.getAllCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      ...booksData,
      result: booksWithCategories,
    };
  },

  async getBookById(bookId: number | string): Promise<Book> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await http.get(`/api/books/${bookId}`) as any;
    
    if (response.data && !response.data.data) {
      const book = response.data;
      try {
        const categories = await categoryService.getAllCategories();
        const categoryList = Array.isArray(categories) ? categories : [];
        const bookCategories = book.categoryIds && book.categoryIds.length > 0
          ? book.categoryIds
              .map((id: number) => categoryList.find((cat: Category) => cat.id === id) || null)
              .filter((cat: Category | null): cat is Category => cat !== null && cat !== undefined)
          : [];
        return { ...book, categories: bookCategories };
      } catch (error) {
        console.error('Error fetching categories for book:', error);
        return book;
      }
    }
    
    const wrappedData = response.data;
    const bookBackendData = wrappedData.data;
    const book = bookBackendData.data;
    
    try {
      const categories = await categoryService.getAllCategories();
      const categoryList = Array.isArray(categories) ? categories : [];
      const bookCategories = book.categoryIds && book.categoryIds.length > 0
        ? book.categoryIds
            .map((id: number) => categoryList.find((cat: Category) => cat.id === id) || null)
            .filter((cat: Category | null): cat is Category => cat !== null && cat !== undefined)
        : [];
      return { ...book, categories: bookCategories };
    } catch (error) {
      console.error('Error fetching categories for book:', error);
      return book;
    }
  },

  async createBook(payload: CreateBookRequest): Promise<Book> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await http.post("/api/books", payload) as any;
    return response.data;
  },

  async updateBook(bookId: number | string, payload: UpdateBookRequest): Promise<Book> {
    try {
      const response = await http.put(
        `/api/books/${bookId}`,
        payload,
      ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      return response.data?.data?.data || response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteBook(bookId: number | string): Promise<null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await http.del(`/api/books/${bookId}`) as any;
      return response.data?.data || response.data;
    } catch (error: unknown) {
      return null;
    }
  },

  async getSortedBooks(): Promise<BookListData> {
    const response = await http.get("/api/books/sorted") as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (Array.isArray(response.data)) {
      return {
        result: response.data,
        meta: { page: 1, pageSize: 10, total: response.data.length, pages: 1 }
      };
    }
    return response.data.data.data;
  },

  async getBooksByCategory(categoryId: number | string): Promise<BookListData> {
    const response = await http.get(`/api/books/category/${categoryId}`) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (Array.isArray(response.data)) {
      return {
        result: response.data,
        meta: { page: 1, pageSize: 10, total: response.data.length, pages: 1 }
      };
    }
    return response.data;
  },
};
