import BaseApiClient from '@/shared/lib/api/base-client';
import { Movie } from '@/types';

class RecommendationService extends BaseApiClient {
    async getRecommendations(limit = 10) {
        return this.request<Movie[]>(`/recommendations?limit=${limit}`);
    }
}

export const recommendationService = new RecommendationService();
export default RecommendationService;
