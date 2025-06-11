import apiClient from "@/data/apiClient";
import { GetBooksRequest } from "../requests/FetchBookRequest";
import { GetBooksResponse } from "../responses/GetBookResponse";
import {BookModel} from "@/data/models/BookModel";
import {BookUserContentModel} from "@/data/models/UserContent";
export class BookService {
    constructor() {}

    async getBooks(params?: GetBooksRequest): Promise<GetBooksResponse> {
        const response = await apiClient.get('/books/', { params });
        console.log(response.data);
        return response.data;
    }

    async getBookById(id: number): Promise<BookModel> {
        const response = await apiClient.get(`/books/${id}/`);
        return response.data;
    }

    async searchBooks(query: string, page?: number): Promise<GetBooksResponse> {
        return this.getBooks({
            search: query,
            page: page,
            ordering: '-download_count'
        });
    }

    async getBooksByAuthor(authorId: number, page?: number): Promise<GetBooksResponse> {
        return this.getBooks({
            author: authorId,
            page: page
        });
    }

    async getBooksByLanguage(languageCode: string, page?: number): Promise<GetBooksResponse> {
        return this.getBooks({
            language: languageCode,
            page: page
        });
    }

    async getPopularBooks(page?: number): Promise<GetBooksResponse> {
        return this.getBooks({
            ordering: '-download_count',
            page: page
        });
    }

    async getBookUserContent(gutenbergId: number): Promise<BookUserContentModel> {
        const response = await apiClient.get(`/books/${gutenbergId}/content/`);
        return response.data;
    }
}

export const bookService = new BookService();