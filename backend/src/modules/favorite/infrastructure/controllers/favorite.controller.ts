import { Controller, Get, Post, Param, UseGuards, Req, Delete, Body } from '@nestjs/common';
import { AddFavoriteUseCase, GetUserFavoritesUseCase, RemoveFavoriteUseCase } from '../../application';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
    constructor(
        private readonly addFavoriteUseCase: AddFavoriteUseCase,
        private readonly getUserFavoritesUseCase: GetUserFavoritesUseCase,
        private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
    ) { }

    @Get()
    async getUserFavorites(@Req() req: any) {
        const result = await this.getUserFavoritesUseCase.execute({
            userId: req.user.userId,
        });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        // Return favorites with movie details
        return {
            success: true,
            data: result.value.map((f: any) => ({
                id: f.id,
                movieId: f.movieId,
                createdAt: f.createdAt,
                movie: f.movie ? {
                    id: f.movie.id,
                    externalId: f.movie.externalId,
                    title: f.movie.title,
                    originalTitle: f.movie.originalTitle,
                    mediaType: f.movie.mediaType,
                    description: f.movie.description,
                    posterUrl: f.movie.posterUrl,
                    backdropUrl: f.movie.backdropUrl,
                    trailerUrl: f.movie.trailerUrl,
                    releaseDate: f.movie.releaseDate,
                    duration: f.movie.duration,
                    rating: f.movie.rating,
                    genres: f.movie.genres,
                } : null,
            })),
        };
    }

    @Post(':movieId')
    async addFavorite(
        @Req() req: any, 
        @Param('movieId') movieId: string,
        @Body() body?: { externalId?: string; movieData?: any }
    ) {
        const result = await this.addFavoriteUseCase.execute({
            userId: req.user.userId,
            movieId, // This can be internal UUID or externalId
            externalId: body?.externalId,
            movieData: body?.movieData,
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
            message: 'Movie added to favorites',
        };
    }

    @Delete(':movieId')
    async removeFavorite(@Req() req: any, @Param('movieId') movieId: string) {
        const result = await this.removeFavoriteUseCase.execute({
            userId: req.user.userId,
            movieId, // Can be internal UUID or externalId (TMDB ID)
        });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        return {
            success: true,
            message: 'Movie removed from favorites',
        };
    }
}
