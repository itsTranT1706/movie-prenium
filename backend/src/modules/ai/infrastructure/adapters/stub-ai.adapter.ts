import { Injectable, Logger } from '@nestjs/common';
import { Movie } from '@/modules/movie/domain';
import {
    AIRecommendationPort,
    AIRecommendation,
    RecommendationContext,
} from '../../domain';

/**
 * ========================================
 * STUB AI ADAPTER - NO REAL IMPLEMENTATION
 * ========================================
 * 
 * This adapter is a PLACEHOLDER that throws NotImplementedError.
 * It exists to demonstrate how AI integration will work.
 * 
 * WHEN IMPLEMENTING AI:
 * 1. Create a new adapter (e.g., OpenAIRecommendationAdapter)
 * 2. Implement the AIRecommendationPort interface
 * 3. Swap the provider binding in ai.module.ts
 * 
 * Example implementation might use:
 * - OpenAI embeddings for similarity
 * - TensorFlow.js for on-device inference
 * - External ML service APIs
 */
@Injectable()
export class StubAIAdapter implements AIRecommendationPort {
    private readonly logger = new Logger(StubAIAdapter.name);

    async getPersonalizedRecommendations(
        userId: string,
        context?: RecommendationContext,
    ): Promise<AIRecommendation[]> {
        this.logger.warn(`[STUB] AI recommendations not implemented for user: ${userId}`);
        // TODO: Implement with actual AI/ML model
        throw new Error('AI recommendations not implemented');
    }

    async findSimilarByEmbedding(movieId: string, limit = 10): Promise<Movie[]> {
        this.logger.warn(`[STUB] Embedding similarity not implemented for movie: ${movieId}`);
        // TODO: Implement with vector embeddings
        throw new Error('Embedding similarity not implemented');
    }

    async explainRecommendation(userId: string, movieId: string): Promise<string> {
        this.logger.warn(`[STUB] Recommendation explanation not implemented`);
        // TODO: Implement with LLM
        throw new Error('Recommendation explanation not implemented');
    }
}
