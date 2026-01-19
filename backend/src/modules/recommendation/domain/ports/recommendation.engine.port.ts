import { Movie } from '@/modules/movie/domain';

/**
 * Recommendation Engine Port - Abstraction for recommendation service
 * 
 * TODAY: Simple rule-based recommendations
 * FUTURE: AI-powered personalized recommendations
 */
export interface RecommendationEnginePort {
    getRecommendationsForUser(userId: string, limit?: number): Promise<Movie[]>;
    getSimilarMovies(movieId: string, limit?: number): Promise<Movie[]>;
    getTrendingMovies(limit?: number): Promise<Movie[]>;
}

export const RECOMMENDATION_ENGINE = Symbol('RECOMMENDATION_ENGINE');
