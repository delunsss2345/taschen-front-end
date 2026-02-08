import { bookApi } from "@/services/bookService";
import type { Book, BookApiResponse, BooksApiResponse } from "@/types/book";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type BookState = {
    books: Book[];
    isLoadingBook: boolean;
    selectedBook: Book | null;
    isLoadingSelectedBook: boolean;
    error: string | null;
};

const initialState: BookState = {
    books: [],
    isLoadingBook: false,
    selectedBook: null,
    isLoadingSelectedBook: false,
    error: null,
};

export const fetchBooks = createAsyncThunk<BooksApiResponse, void>(
    "book/fetchBooks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await bookApi.getBooks();
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to fetch books",
            });
        }
    }
);

export const fetchBookById = createAsyncThunk<BookApiResponse, number>(
    "book/fetchBookById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await bookApi.getBookById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to fetch book",
            });
        }
    }
);

export const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        clearBooks(state) {
            state.books = [];
            state.error = null;
        },
        clearSelectedBook(state) {
            state.selectedBook = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBooks.pending, (state) => {
            state.isLoadingBook = true;
            state.error = null;
        });

        builder.addCase(fetchBooks.fulfilled, (state, action) => {
            state.isLoadingBook = false;
            state.books = action.payload.data;
            state.error = null;
        });

        builder.addCase(fetchBooks.rejected, (state, action) => {
            state.isLoadingBook = false;
            state.error = action.payload as string;
        });

        // fetchBookById cases
        builder.addCase(fetchBookById.pending, (state) => {
            state.isLoadingSelectedBook = true;
            state.error = null;
        });

        builder.addCase(fetchBookById.fulfilled, (state, action) => {
            state.isLoadingSelectedBook = false;
            state.selectedBook = action.payload.data;
            state.error = null;
        });

        builder.addCase(fetchBookById.rejected, (state, action) => {
            state.isLoadingSelectedBook = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearBooks, clearSelectedBook } = bookSlice.actions;
