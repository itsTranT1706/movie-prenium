import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ReactToMovieUseCase, GetReactionStatsUseCase } from '../../application/use-cases';
import { ReactionType } from '../../domain/entities/reaction.entity';


@Controller('movies/reactions')
export class MovieReactionController {
    constructor(
        private readonly reactToMovieUseCase: ReactToMovieUseCase,
        private readonly getReactionStatsUseCase: GetReactionStatsUseCase,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async react(
        @Param('id') movieId: string,
        @Request() req: any,
        @Body() body: { reaction: ReactionType; score: number; review?: string },
    ) {
        const result = await this.reactToMovieUseCase.execute(
            req.user.userId,
            movieId,
            body.reaction,
            body.score,
            body.review,
        );
        return {
            success: true,
            data: result,
        };
    }

    @Get(':id/stats')

    async getStats(@Param('id') movieId: string) {
        const stats = await this.getReactionStatsUseCase.execute(movieId);
        return {
            success: true,
            data: stats
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/my-reaction')
    async getMyReaction(@Param('id') movieId: string, @Request() req: any) {
        const reaction = await this.getReactionStatsUseCase.getUserReaction(req.user.userId, movieId);
        return {
            success: true,
            data: reaction
        };
    }
}
