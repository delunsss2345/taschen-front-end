"use client";

import { bookService } from "@/services/book.service";
import type {
  CreateBookRequest,
  UpdateBookInfoRequest,
} from "@/types/request/book.request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/features/category/hooks";
import { useSuppliers } from "@/features/supplier/hooks";
import {
  mapBooksWithCategories,
  mapBooksWithSuppliers,
  mapBookCategories,
} from "@/services/helpers/books";

export const bookQueryKeys = {
  all: ["books"] as const,
  detail: (bookId: number | string) => ["books", "detail", bookId] as const,
  sorted: ["books", "sorted"] as const,
  byCategory: (categoryId: number | string) =>
    ["books", "category", categoryId] as const,
};

export const useBooksQuery = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  const { data: categories = [] } = useCategories();
  const { data: suppliers = [] } = useSuppliers();

  return useQuery({
    queryKey: [...bookQueryKeys.all, "list", params],
    queryFn: () => bookService.getAllBooks(params),
    select: (data) => {
      const booksWithCategories = mapBooksWithCategories(
        data.result,
        categories,
      );
      const booksWithSuppliers = mapBooksWithSuppliers(
        booksWithCategories,
        suppliers,
      );
      return {
        ...data,
        result: booksWithSuppliers,
      };
    },
  });
};

export const useBookByIdQuery = (
  bookId: number | string | null | undefined,
) => {
  const { data: categories = [] } = useCategories();

  return useQuery({
    queryKey: bookQueryKeys.detail(bookId ?? "unknown"),
    queryFn: () => bookService.getBookById(bookId as number | string),
    enabled: Boolean(bookId),
    select: (book) => {
      const bookCategories = mapBookCategories(book, categories);
      return { ...book, categories: bookCategories };
    },
  });
};

export const useSortedBooksQuery = () => {
  return useQuery({
    queryKey: bookQueryKeys.sorted,
    queryFn: () => bookService.getSortedBooks(),
  });
};

export const useBooksByCategoryQuery = (
  categoryId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: bookQueryKeys.byCategory(categoryId ?? "unknown"),
    queryFn: () =>
      bookService.getBooksByCategory(categoryId as number | string),
    enabled: Boolean(categoryId),
  });
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookRequest) => bookService.createBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.sorted });
    },
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      payload,
    }: {
      bookId: number | string;
      payload: UpdateBookInfoRequest;
    }) => bookService.updateBook(bookId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.sorted });
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.detail(variables.bookId),
      });
    },
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number | string) => bookService.deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.sorted });
    },
  });
};
