"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookService } from "@/services/book.service";
import type {
  CreateBookRequest,
  UpdateBookRequest,
} from "@/types/request/book.request";

export const bookQueryKeys = {
  all: ["books"] as const,
  detail: (bookId: number | string) => ["books", "detail", bookId] as const,
  sorted: ["books", "sorted"] as const,
  byCategory: (categoryId: number | string) =>
    ["books", "category", categoryId] as const,
};

export const useBooksQuery = () => {
  return useQuery({
    queryKey: bookQueryKeys.all,
    queryFn: () => bookService.getAllBooks(),
  });
};

export const useBookByIdQuery = (bookId: number | string | null | undefined) => {
  return useQuery({
    queryKey: bookQueryKeys.detail(bookId ?? "unknown"),
    queryFn: () => bookService.getBookById(bookId as number | string),
    enabled: Boolean(bookId),
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
    queryFn: () => bookService.getBooksByCategory(categoryId as number | string),
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
      payload: UpdateBookRequest;
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
