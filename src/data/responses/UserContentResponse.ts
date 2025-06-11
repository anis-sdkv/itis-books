import {PaginatedResponse} from "@/data/responses/PaginatedResponse";
import {LikedBookModel, QuoteModel, ReviewModel, ShelfModel} from "@/data/models/UserContent";

export type GetLikedBooksResponse = PaginatedResponse<LikedBookModel>;
export type GetReviewsResponse = PaginatedResponse<ReviewModel>;
export type GetQuotesResponse = PaginatedResponse<QuoteModel>;
export type GetShelvesResponse = PaginatedResponse<ShelfModel>;