import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchMoviesUseCase, GetPopularMoviesUseCase, GetMovieStreamsUseCase, GetCinemaMoviesUseCase } from '../../application';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly searchMoviesUseCase: SearchMoviesUseCase,
        private readonly getPopularMoviesUseCase: GetPopularMoviesUseCase,
        private readonly getMovieStreamsUseCase: GetMovieStreamsUseCase,
        private readonly getCinemaMoviesUseCase: GetCinemaMoviesUseCase,
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

    @Get('cinema')
    async getCinemaMovies(
        @Query('page') page = 1,
        @Query('limit') limit = 24,
    ) {
        const movies = await this.getCinemaMoviesUseCase.execute(Number(page), Number(limit));

        return {
            success: true,
            data: movies.map(this.toResponse),
        };
    }

    /**
     * Get streaming sources for a movie
     * @param tmdbId - TMDB ID of the movie
     * @param mediaType - 'movie' or 'tv' (default: 'movie')
     * @param originalName - Optional original title for fallback search
     */
    @Get(':tmdbId/streams')
    async getMovieStreams(
        @Param('tmdbId') tmdbId: string,
        @Query('mediaType') mediaType: 'movie' | 'tv' = 'movie',
        @Query('originalName') originalName?: string,
    ) {
        const sources = await this.getMovieStreamsUseCase.execute(
            tmdbId,
            mediaType,
            originalName,
        );

        return {
            success: true,
            data: sources.map(source => ({
                provider: source.provider,
                serverName: source.serverName,
                quality: source.quality,
                language: source.language,
                episodes: source.episodes.map(ep => ({
                    episodeNumber: ep.episodeNumber,
                    title: ep.title,
                    slug: ep.slug,
                    streamUrl: ep.streamUrl,
                    embedUrl: ep.embedUrl,
                })),
            })),
        };
    }

    private toResponse(movie: any) {
        return {
            id: movie.id,
            externalId: movie.externalId,
            title: movie.title,
            mediaType: movie.mediaType,
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

