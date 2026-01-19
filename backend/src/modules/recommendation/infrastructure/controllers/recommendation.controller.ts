import { Controller, Get, Param, UseGuards, Req, Query } from '@nestjs/common';
import { GetRecommendationsUseCase } from '../../application';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';

@Controller('recommendations')
export class RecommendationController {
    constructor(
        private readonly getRecommendationsUseCase: GetRecommendationsUseCase,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getRecommendations(@Req() req: any, @Query('limit') limit = 10) {
        const result = await this.getRecommendationsUseCase.execute({
            userId: req.user.userId,
            limit: Number(limit),
        });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        return {
            success: true,
            data: result.value.map((m) => ({
                id: m.id,
                title: m.title,
                posterUrl: m.posterUrl,
                rating: m.rating,
            })),
        };
    }
}
