import type { BookApiResponse, BooksApiResponse } from "@/types/book";
import { http } from "@/utils/http";


export const bookApi = {
    getBooks: async () => {
        const response = await http.get<BooksApiResponse>(`/books`);
        return response;
    },

    getBookById: async (id: number) => {
        const response = await http.get<BookApiResponse>(`/books/${id}`);
        return response;
    },
};
