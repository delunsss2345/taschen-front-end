import type { BookStoreState } from "../store/book.store";

export const selectorBook = (state: BookStoreState) => state;

export const selectorSelectedBookId = (state: BookStoreState) =>
  state.selectedBookId;

export const selectorSelectedCategoryId = (state: BookStoreState) =>
  state.selectedCategoryId;

export const selectorBookSort = (state: BookStoreState) => state.sortBy;
