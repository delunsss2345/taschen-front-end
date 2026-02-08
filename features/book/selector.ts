import type { RootState } from "@/store";

export const selectBooks = (state: RootState) => state.book.books;
export const selectIsLoadingBook = (state: RootState) => state.book.isLoadingBook;
export const selectBookError = (state: RootState) => state.book.error;
