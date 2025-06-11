import {UserModel} from "@/data/models/UserModel";

export interface LikedBookModel {
    id: number;
    gutenberg_id: number;
    added_at: string;
}

// models/ReviewModel.ts
export interface ReviewModel {
    id: number;
    gutenberg_id: number;
    rating: number;
    text: string;
    created_at: string;
    user: UserModel;
}

// models/QuoteModel.ts
export interface QuoteModel {
    id: number;
    gutenberg_id: number;
    text: string;
    page_reference: string;
    created_at: string;
    user?: {
        id: number;
        username: string;
        first_name?: string;
        last_name?: string;
    };
}

// models/BookUserContentModel.ts
export interface BookUserContentModel {
    reviews: ReviewModel[];
    quotes: QuoteModel[];
    likes_count: number;
}

export interface ShelfModel {
    id: number;
    name: string;
    books: number[];
}

