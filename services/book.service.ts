import type {
  CreateBookRequest,
  UpdateBookInfoRequest,
  UpdateVariantRequest,
} from "@/types/request/book.request";
import type {
  Book,
  BookListData,
  BookListMeta,
} from "@/types/response/book.response";
import type { Category } from "@/types/response/category.response";
import type { Supplier } from "@/types/response/supplier.response";
import { http } from "@/utils/http";
import { categoryService } from "./category.service";
import { supplierService } from "./supplier.service";
import {
  getListData,
  getArrayData,
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export const bookService = {
  async searchBooks(params: {
    keyword?: string;
    categoryId?: number;
    status?: 'active' | 'deleted' | 'all';
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<BookListData> {
    const query: Record<string, string | number> = {};
    if (params.keyword) query.keyword = params.keyword;
    if (params.categoryId) query.categoryId = params.categoryId;
    if (params.status) query.status = params.status;
    if (params.page) query.page = params.page;
    if (params.size) query.size = params.size;
    if (params.sortBy) query.sortBy = params.sortBy;
    if (params.sortDir) query.sortDir = params.sortDir;

    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)]))
    ).toString();
    const url = queryString ? `books/search?${queryString}` : 'books/search';

    const response = await http.get<{ success: boolean; data: { meta: BookListMeta; result: Book[] } }>(url);
    const booksResult: Book[] = response.data?.result ?? [];
    const meta: BookListMeta | undefined = response.data?.meta;

    const categories = await getCategoriesSafe();
    const suppliers = await getSuppliersSafe();
    const booksWithCategories = mapBooksWithCategories(booksResult, categories);
    const booksWithSuppliers = mapBooksWithSuppliers(booksWithCategories, suppliers);

    return {
      result: booksWithSuppliers,
      meta: meta ?? { page: 1, pageSize: 10, total: 0, pages: 0 },
    };
  },

  async restoreBook(bookId: number | string): Promise<void> {
    await http.put(`books/${bookId}/restore`, {});
  },

  async getAllBooks(params?: { page?: number; pageSize?: number; search?: string }): Promise<BookListData> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.set('search', params.search);

    const queryString = queryParams.toString();
    const url = queryString ? `books?${queryString}` : 'books';

    const response = await http.get<ApiResponseEnvelope<BookListData>>(url);
    const { data: booksResult, meta } = getListData<Book, BookListMeta>(response);

    const categories = await getCategoriesSafe();
    const suppliers = await getSuppliersSafe();
    const booksWithCategories = mapBooksWithCategories(booksResult, categories);
    const booksWithSuppliers = mapBooksWithSuppliers(booksWithCategories, suppliers);

    return {
      result: booksWithSuppliers,
      meta: meta ?? { page: 1, pageSize: 10, total: 0, pages: 0 }
    };
  },

  async getBookById(bookId: number | string): Promise<Book> {
    const response = await http.get<ApiResponseEnvelope<Book>>(`books/${bookId}`);
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
    const response = await http.post<ApiResponseEnvelope<Book>>("books", payload);
    return requireResponseData(response, "Create book response is missing data");
  },

  async updateBook(bookId: number | string, payload: UpdateBookInfoRequest): Promise<Book> {
    const response = await http.put<ApiResponseEnvelope<Book>>(`books/${bookId}`, payload);
    return requireResponseData(response, "Update book response is missing data");
  },

  async deleteBook(bookId: number | string): Promise<void> {
    await http.del(`books/${bookId}`);
  },

  async getSortedBooks(): Promise<BookListData> {
    const response = await http.get<ApiResponseEnvelope<BookListData | Book[]>>("books/sorted");
    const { data: booksResult, meta } = getListData<Book, BookListMeta>(response);

    return {
      result: booksResult,
      meta: meta ?? { page: 1, pageSize: 10, total: booksResult.length, pages: 1 }
    };
  },

  async getBooksByCategory(categoryId: number | string): Promise<BookListData> {
    const response = await http.get<ApiResponseEnvelope<BookListData | Book[]>>(
      `books/category/${categoryId}`,
    );
    const { data: booksResult, meta } = getListData<Book, BookListMeta>(response);

    return {
      result: booksResult,
      meta: meta ?? { page: 1, pageSize: 10, total: booksResult.length, pages: 1 }
    };
  },

  async getBooksBySupplier(supplierId: number | string): Promise<BookListData> {
    const response = await http.get<ApiResponseEnvelope<BookListData | Book[]>>(
      `books/supplier/${supplierId}`,
    );
    const { data: booksResult, meta } = getListData<Book, BookListMeta>(response);

    return {
      result: booksResult,
      meta: meta ?? { page: 1, pageSize: 10, total: booksResult.length, pages: 1 }
    };
  },

  async getSimpleBooks(): Promise<{ id: number; title: string }[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Book[]>>("books?pageSize=1000");
      const data = getArrayData<Book>(response);
      return data.map(book => ({ id: book.id, title: book.title }));
    } catch {
      return [];
    }
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

async function getSuppliersSafe(): Promise<Supplier[]> {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    return Array.isArray(suppliers) ? suppliers : [];
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

function mapBooksWithSuppliers(books: Book[], suppliers: Supplier[]): Book[] {
  return books.map(book => ({
    ...book,
    supplier: book.supplierId 
      ? suppliers.find(s => s.id === book.supplierId) || undefined
      : undefined
  }));
}
