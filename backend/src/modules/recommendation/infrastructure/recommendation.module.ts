import { Module } from '@nestjs/common';
import { RECOMMENDATION_ENGINE } from '../domain';
import { GetRecommendationsUseCase } from '../application';
import { SimpleRecommendationEngine } from './adapters';
import { RecommendationController } from './controllers';

@Module({
    controllers: [RecommendationController],
    providers: [
        GetRecommendationsUseCase,
        {
            provide: RECOMMENDATION_ENGINE,
            useClass: SimpleRecommendationEngine,
        },
    ],
    exports: [RECOMMENDATION_ENGINE],
})
export class RecommendationModule { }
