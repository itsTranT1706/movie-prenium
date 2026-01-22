import { Controller, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import {
    SearchMoviesUseCase,
    GetPopularMoviesUseCase,
    GetMovieStreamsUseCase,
    GetCinemaMoviesUseCase,
    GetMoviesByGenreUseCase,
    GetMoviesByCountryUseCase,
    GetTrendingMoviesUseCase,
    GetUpcomingMoviesUseCase,
    GetMovieDetailsUseCase,
} from '../../application';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly searchMoviesUseCase: SearchMoviesUseCase,
        private readonly getPopularMoviesUseCase: GetPopularMoviesUseCase,
        private readonly getMovieStreamsUseCase: GetMovieStreamsUseCase,
        private readonly getCinemaMoviesUseCase: GetCinemaMoviesUseCase,
        private readonly getMoviesByGenreUseCase: GetMoviesByGenreUseCase,
        private readonly getMoviesByCountryUseCase: GetMoviesByCountryUseCase,
        private readonly getTrendingMoviesUseCase: GetTrendingMoviesUseCase,
        private readonly getUpcomingMoviesUseCase: GetUpcomingMoviesUseCase,
        private readonly getMovieDetailsUseCase: GetMovieDetailsUseCase,
    ) { }

    @Get('search')
    async searchMovies(@Query('q') query: string) {
        const result = await this.searchMoviesUseCase.execute({ query });

        if (result.isFailure) {
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
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
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
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
     * Get movies by genre
     * @param genre - Genre slug (e.g., 'hanh-dong', 'tinh-cam')
     * @param page - Page number (default: 1)
     */
    @Get('genre/:genre')
    async getMoviesByGenre(
        @Param('genre') genre: string,
        @Query('page') page = 1,
    ) {
        const result = await this.getMoviesByGenreUseCase.execute(genre, Number(page));

        if (result.isFailure) {
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return {
            success: true,
            data: result.value.map(this.toResponse),
        };
    }

    /**
     * Get movies by country
     * @param country - Country slug (e.g., 'han-quoc', 'trung-quoc', 'au-my')
     * @param page - Page number (default: 1)
     */
    @Get('country/:country')
    async getMoviesByCountry(
        @Param('country') country: string,
        @Query('page') page = 1,
    ) {
        const result = await this.getMoviesByCountryUseCase.execute(country, Number(page));

        if (result.isFailure) {
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return {
            success: true,
            data: result.value.map(this.toResponse),
        };
    }

    /**
     * Get trending movies
     * @param timeWindow - 'day' or 'week' (default: 'week')
     */
    @Get('trending')
    async getTrendingMovies(
        @Query('timeWindow') timeWindow: 'day' | 'week' = 'week',
    ) {
        const result = await this.getTrendingMoviesUseCase.execute(timeWindow);

        if (result.isFailure) {
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return {
            success: true,
            data: result.value.map(this.toResponse),
        };
    }

    /**
     * Get upcoming movies
     * @param page - Page number (default: 1)
     */
    @Get('upcoming')
    async getUpcomingMovies(@Query('page') page = 1) {
        const result = await this.getUpcomingMoviesUseCase.execute(Number(page));

        if (result.isFailure) {
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return {
            success: true,
            data: result.value.map(this.toResponse),
        };
    }

    /**
     * Get streaming sources for a movie
     * @param id - TMDB ID of the movie
     * @returns Streaming sources from KKPhim
     */
    @Get(':id/streams')
    async getMovieStreams(
        @Param('id') tmdbId: string,
    ) {
        const result = await this.getMovieStreamsUseCase.execute(tmdbId);

        if (result.isFailure) {
            throw new HttpException(
                'Streaming not available',
                HttpStatus.NOT_FOUND
            );
        }

        return {
            success: true,
            data: result.value.map(source => ({
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

    /**
     * Get movie details by TMDB ID
     * @param id - TMDB ID of the movie
     * @returns Movie metadata from TMDB with streaming sources from KKPhim
     */
    @Get(':id')
    async getMovieDetails(@Param('id') tmdbId: string) {
        const result = await this.getMovieDetailsUseCase.execute(tmdbId);

        if (result.isFailure) {
            const errorMessage = result.error.message || 'Movie not found';
            
            // Handle rate limit errors with retry-after header
            if (errorMessage.includes('Too many requests')) {
                throw new HttpException(
                    'Too many requests. Please try again later.',
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }
            
            // Handle not found errors
            if (errorMessage.includes('not found')) {
                throw new HttpException(
                    'Movie not found',
                    HttpStatus.NOT_FOUND
                );
            }
            
            // Generic error
            throw new HttpException(
                errorMessage,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        if (!result.value) {
            throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
        }

        const { movie, sources } = result.value;

        return {
            success: true,
            data: {
                ...this.toResponse(movie),
                sources: sources.map(source => ({
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
            },
        };
    }

    private toResponse(movie: any) {
        return {
            id: movie.id,
            externalId: movie.externalId,
            slug: movie.slug,
            title: movie.title,
            originalTitle: movie.originalTitle,
            mediaType: movie.mediaType,
            description: movie.description,
            posterUrl: movie.posterUrl,
            backdropUrl: movie.backdropUrl,
            trailerUrl: movie.trailerUrl,
            releaseDate: movie.releaseDate,
            duration: movie.duration,
            rating: movie.rating,
            genres: movie.genres,
            cast: movie.cast,
            director: movie.director,
            country: movie.country,
            quality: movie.quality,
            lang: movie.lang,
            episodeCurrent: movie.episodeCurrent,
        };
    }
}

