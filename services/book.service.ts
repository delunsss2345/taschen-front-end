import type {
  CreateBookRequest,
  UpdateBookRequest,
} from "@/types/request/book.request";
import type {
  Book,
  BookListData,
  RouteSuccessResponse,
} from "@/types/response/book.response";
import { http } from "@/utils/http";

export const bookService = {
  async getAllBooks(): Promise<BookListData> {
    const response = await http.get<RouteSuccessResponse<BookListData>>("/books");
    return response.data;
  },

  async getBookById(bookId: number | string): Promise<Book> {
    const response = await http.get<RouteSuccessResponse<Book>>(`/books/${bookId}`);
    return response.data;
  },

  async createBook(payload: CreateBookRequest): Promise<Book> {
    const response = await http.post<RouteSuccessResponse<Book>>("/books", payload);
    return response.data;
  },

  async updateBook(bookId: number | string, payload: UpdateBookRequest): Promise<Book> {
    const response = await http.put<RouteSuccessResponse<Book>>(
      `/books/${bookId}`,
      payload,
    );

    return response.data;
  },

  async deleteBook(bookId: number | string): Promise<null> {
    const response = await http.del<RouteSuccessResponse<null>>(`/books/${bookId}`);
    return response.data;
  },

  async getSortedBooks(): Promise<BookListData> {
    const response = await http.get<RouteSuccessResponse<BookListData>>(
      "/books/sorted",
    );

    return response.data;
  },

  async getBooksByCategory(categoryId: number | string): Promise<BookListData> {
    const response = await http.get<RouteSuccessResponse<BookListData>>(
      `/books/category/${categoryId}`,
    );

    return response.data;
  },
};
