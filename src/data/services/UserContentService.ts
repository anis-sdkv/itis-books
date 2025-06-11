import apiClient from "@/data/apiClient";
import {LikedBookModel, QuoteModel, ReviewModel, ShelfModel} from "../models/UserContent";
import {
    CreateLikedBookRequest,
    CreateQuoteRequest,
    CreateReviewRequest, CreateShelfRequest, UpdateQuoteRequest,
    UpdateReviewRequest, UpdateShelfRequest
} from "../requests/UserContentRequests";
import {
    GetLikedBooksResponse,
    GetQuotesResponse,
    GetReviewsResponse,
    GetShelvesResponse
} from "@/data/responses/UserContentResponse";
import {PaginatedResponse} from "../responses/PaginatedResponse";

export class UserContentService {
    constructor() {
    }

    // === LIKED BOOKS ===
    async getLikedBooks(): Promise<GetLikedBooksResponse> {
        const response = await apiClient.get('/usercontent/liked-books/');
        return response.data;
    }

    async addToLikedBooks(data: CreateLikedBookRequest): Promise<LikedBookModel> {
        const response = await apiClient.post('/usercontent/liked-books/', data);
        return response.data;
    }

    async removeFromLikedBooks(id: number): Promise<void> {
        await apiClient.delete(`/usercontent/liked-books/${id}/`);
    }

    async checkIfBookLiked(gutenbergId: number): Promise<LikedBookModel | null> {
        try {
            const likedBooks = await this.getLikedBooks();
            console.log("sfsadfa");
            console.log(likedBooks);
            return likedBooks.results.find(book => book.gutenberg_id === gutenbergId) || null;
        } catch (error) {
            console.error('Error checking if book is liked:', error);
            return null;
        }
    }

    // === REVIEWS ===
    async getMyReviews(): Promise<GetReviewsResponse> {
        const response = await apiClient.get('/usercontent/reviews/');
        return response.data;
    }

    async createReview(data: CreateReviewRequest): Promise<ReviewModel> {
        const response = await apiClient.post('/usercontent/reviews/', data);
        return response.data;
    }

    async updateReview(id: number, data: UpdateReviewRequest): Promise<ReviewModel> {
        const response = await apiClient.put(`/usercontent/reviews/${id}/`, data);
        return response.data;
    }

    async deleteReview(id: number): Promise<void> {
        await apiClient.delete(`/usercontent/reviews/${id}/`);
    }

    async getMyReviewForBook(gutenbergId: number): Promise<ReviewModel | null> {
        try {
            const reviews = await this.getMyReviews();
            return reviews.results.find(review => review.gutenberg_id === gutenbergId) || null;
        } catch (error) {
            console.error('Error getting user review for book:', error);
            return null;
        }
    }

    // === QUOTES ===
    async getMyQuotes(): Promise<GetQuotesResponse> {
        const response = await apiClient.get('/usercontent/quotes/');
        return response.data;
    }

    async createQuote(data: CreateQuoteRequest): Promise<QuoteModel> {
        const response = await apiClient.post('/usercontent/quotes/', data);
        return response.data;
    }

    async updateQuote(id: number, data: UpdateQuoteRequest): Promise<QuoteModel> {
        const response = await apiClient.put(`/usercontent/quotes/${id}/`, data);
        return response.data;
    }

    async deleteQuote(id: number): Promise<void> {
        await apiClient.delete(`/usercontent/quotes/${id}/`);
    }

    async getMyQuotesForBook(gutenbergId: number): Promise<QuoteModel[]> {
        try {
            const quotes = await this.getMyQuotes();
            return quotes.results.filter(quote => quote.gutenberg_id === gutenbergId);
        } catch (error) {
            console.error('Error getting user quotes for book:', error);
            return [];
        }
    }

    async getShelves(page: number = 1): Promise<GetShelvesResponse> {
        const response = await apiClient.get('/usercontent/shelves/', {params: {page}});
        return response.data as PaginatedResponse<ShelfModel>;
    }

    async getShelf(shelfId: number): Promise<ShelfModel> {
        const response = await apiClient.get(`/usercontent/shelves/${shelfId}/`);
        return response.data as ShelfModel;
    }

    async createShelf(data: CreateShelfRequest): Promise<ShelfModel> {
        const response = await apiClient.post('/usercontent/shelves/', data);
        return response.data as ShelfModel;
    }

    async updateShelf(shelfId: number, data: UpdateShelfRequest): Promise<ShelfModel> {
        const response = await apiClient.patch(`/usercontent/shelves/${shelfId}/`, data);
        return response.data as ShelfModel;
    }

    async deleteShelf(shelfId: number): Promise<void> {
        await apiClient.delete(`/usercontent/shelves/${shelfId}/`);
    }

}

export const userContentService = new UserContentService();