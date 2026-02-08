import type { BooksApiResponse } from "@/types/book";
import { http } from "@/utils/http";


export const bookApi = {
    getBooks: async () => {
        const response = await http.get<BooksApiResponse>(`/books`);
        return response.data;
    },
};
