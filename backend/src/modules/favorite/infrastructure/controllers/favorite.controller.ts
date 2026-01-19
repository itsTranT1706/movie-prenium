import { Controller, Get, Post, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { AddFavoriteUseCase, GetUserFavoritesUseCase } from '../../application';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
    constructor(
        private readonly addFavoriteUseCase: AddFavoriteUseCase,
        private readonly getUserFavoritesUseCase: GetUserFavoritesUseCase,
    ) { }

    @Get()
    async getUserFavorites(@Req() req: any) {
        const result = await this.getUserFavoritesUseCase.execute({
            userId: req.user.userId,
        });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        return {
            success: true,
            data: result.value.map((f) => ({
                id: f.id,
                movieId: f.movieId,
                createdAt: f.createdAt,
            })),
        };
    }

    @Post(':movieId')
    async addFavorite(@Req() req: any, @Param('movieId') movieId: string) {
        const result = await this.addFavoriteUseCase.execute({
            userId: req.user.userId,
            movieId,
        });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        const favorite = result.value;
        return {
            success: true,
            data: {
                id: favorite.id,
                movieId: favorite.movieId,
                createdAt: favorite.createdAt,
            },
        };
    }
}
