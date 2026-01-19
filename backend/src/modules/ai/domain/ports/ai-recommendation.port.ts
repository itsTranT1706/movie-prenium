import { Movie } from '@/modules/movie/domain';

/**
 * ========================================
 * AI RECOMMENDATION PORT - STUB INTERFACE
 * ========================================
 * 
 * NOT IMPLEMENTED - Interface definition only
 * 
 * This port defines the contract for AI-powered recommendations.
 * When AI features are needed, implement this interface with:
 * - OpenAI embeddings for movie similarity
 * - Collaborative filtering models
 * - Personalization algorithms
 * 
 * USAGE:
 * The RecommendationModule can inject this port to enhance
 * its SimpleRecommendationEngine with AI capabilities.
 */
export interface AIRecommendationPort {
    /**
     * Get personalized recommendations using AI/ML models
     * @param userId - User to generate recommendations for
     * @param context - Additional context (mood, time of day, etc.)
     */
    getPersonalizedRecommendations(
        userId: string,
        context?: RecommendationContext,
    ): Promise<AIRecommendation[]>;

    /**
     * Find similar movies using embedding similarity
     * @param movieId - Reference movie
     * @param limit - Max results
     */
    findSimilarByEmbedding(movieId: string, limit?: number): Promise<Movie[]>;

    /**
     * Explain why a movie was recommended
     * @param userId - User
     * @param movieId - Recommended movie
     */
    explainRecommendation(userId: string, movieId: string): Promise<string>;
}

export interface RecommendationContext {
    mood?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    watchWith?: 'alone' | 'partner' | 'family' | 'friends';
    duration?: 'short' | 'medium' | 'long';
}

export interface AIRecommendation {
    movie: Movie;
    score: number;
    reason: string;
}

export const AI_RECOMMENDATION = Symbol('AI_RECOMMENDATION');
