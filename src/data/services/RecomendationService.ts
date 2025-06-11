import apiClient from "@/data/apiClient";
import {Recommendation} from "@/data/models/Recommedation";

export class RecommendService {
    static async getRecommendationsByBooks(bookIds: number[], topN: number = 10): Promise<Recommendation[]> {
        const response = await apiClient.post<Recommendation[]>('/recommender/recommend/', {
            book_ids: bookIds,
            top_n: topN,
        });
        return response.data;
    }
}