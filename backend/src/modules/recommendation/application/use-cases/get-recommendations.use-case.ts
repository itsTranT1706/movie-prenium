import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie } from '@/modules/movie/domain';
import { RECOMMENDATION_ENGINE, RecommendationEnginePort } from '../../domain';

export interface GetRecommendationsInput {
    userId: string;
    limit?: number;
}

@Injectable()
export class GetRecommendationsUseCase {
    constructor(
        @Inject(RECOMMENDATION_ENGINE)
        private readonly recommendationEngine: RecommendationEnginePort,
    ) { }

    async execute(input: GetRecommendationsInput): Promise<Result<Movie[]>> {
        try {
            const movies = await this.recommendationEngine.getRecommendationsForUser(
                input.userId,
                input.limit || 10,
            );
            return Result.ok(movies);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
