"use client";

import { create } from "zustand";

export type BookSort =
  | "default"
  | "price_asc"
  | "price_desc"
  | "title_asc"
  | "title_desc";

export type BookStoreState = {
  selectedBookId: number | null;
  selectedCategoryId: number | null;
  sortBy: BookSort;
  setSelectedBookId: (bookId: number | null) => void;
  setSelectedCategoryId: (categoryId: number | null) => void;
  setSortBy: (sortBy: BookSort) => void;
  resetBookFilters: () => void;
};

export const useBookStore = create<BookStoreState>((set) => ({
  selectedBookId: null,
  selectedCategoryId: null,
  sortBy: "default",

  setSelectedBookId: (bookId) => {
    set({ selectedBookId: bookId });
  },

  setSelectedCategoryId: (categoryId) => {
    set({ selectedCategoryId: categoryId });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  resetBookFilters: () => {
    set({
      selectedBookId: null,
      selectedCategoryId: null,
      sortBy: "default",
    });
  },
}));
