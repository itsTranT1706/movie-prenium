import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchMoviesUseCase, GetPopularMoviesUseCase } from '../../application';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly searchMoviesUseCase: SearchMoviesUseCase,
        private readonly getPopularMoviesUseCase: GetPopularMoviesUseCase,
    ) { }

    @Get('search')
    async searchMovies(@Query('q') query: string) {
        const result = await this.searchMoviesUseCase.execute({ query });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        return {
            success: true,
            data: result.value.map(this.toResponse),
        };
    }

    @Get('popular')
    async getPopularMovies(@Query('page') page = 1) {
        const result = await this.getPopularMoviesUseCase.execute(Number(page));

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        return {
            success: true,
            data: result.value.map(this.toResponse),
        };
    }

    private toResponse(movie: any) {
        return {
            id: movie.id,
            title: movie.title,
            description: movie.description,
            posterUrl: movie.posterUrl,
            backdropUrl: movie.backdropUrl,
            releaseDate: movie.releaseDate,
            duration: movie.duration,
            rating: movie.rating,
            genres: movie.genres,
        };
    }
}
