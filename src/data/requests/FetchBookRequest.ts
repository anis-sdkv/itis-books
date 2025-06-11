export interface GetBooksRequest {
    search?: string;
    author?: number;
    language?: string;
    subject?: number;
    ordering?: string;  // 'title' | 'download_count' | '-download_count';
    page?: number;
    page_size?: number;
}