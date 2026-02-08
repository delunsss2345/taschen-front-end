import { bookApi } from "@/services/bookService";
import type { Book, BooksApiResponse } from "@/types/book";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type BookState = {
    books: Book[];
    isLoadingBook: boolean;
    error: string | null;
};

const initialState: BookState = {
    books: [],
    isLoadingBook: false,
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

export const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        clearBooks(state) {
            state.books = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchBooks
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
    },
});

export const { clearBooks } = bookSlice.actions;
