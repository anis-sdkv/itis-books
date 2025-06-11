// requests/CreateLikedBookRequest.ts
export interface CreateLikedBookRequest {
    gutenberg_id: number;
}

// requests/CreateReviewRequest.ts
export interface CreateReviewRequest {
    gutenberg_id: number;
    rating: number;
    text: string;
}

// requests/UpdateReviewRequest.ts
export interface UpdateReviewRequest {
    rating?: number;
    text?: string;
}

// requests/CreateQuoteRequest.ts
export interface CreateQuoteRequest {
    gutenberg_id: number;
    text: string;
    page_reference?: string;
}

// requests/UpdateQuoteRequest.ts
export interface UpdateQuoteRequest {
    text?: string;
    page_reference?: string;
}

export interface CreateShelfRequest {
    name: string;
    book_ids?: number[];
}

export interface UpdateShelfRequest {
    name?: string;
    book_ids?: number[];
}


