import { Controller, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import {
    SearchMoviesUseCase,
    GetPopularMoviesUseCase,
    GetTopRatedMoviesUseCase,
    GetMovieStreamsUseCase,
    GetCinemaMoviesUseCase,
    GetMoviesByGenreUseCase,
    GetMoviesByCountryUseCase,
    GetTrendingMoviesUseCase,
    GetUpcomingMoviesUseCase,
    GetMovieDetailsUseCase,
    FilterMoviesUseCase,
} from '../../application';
import { KKPhimMovieProvider } from '../adapters';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly searchMoviesUseCase: SearchMoviesUseCase,
        private readonly getPopularMoviesUseCase: GetPopularMoviesUseCase,
        private readonly getTopRatedMoviesUseCase: GetTopRatedMoviesUseCase,
        private readonly getMovieStreamsUseCase: GetMovieStreamsUseCase,
        private readonly getCinemaMoviesUseCase: GetCinemaMoviesUseCase,
        private readonly getMoviesByGenreUseCase: GetMoviesByGenreUseCase,
        private readonly getMoviesByCountryUseCase: GetMoviesByCountryUseCase,
        private readonly getTrendingMoviesUseCase: GetTrendingMoviesUseCase,
        private readonly getUpcomingMoviesUseCase: GetUpcomingMoviesUseCase,
        private readonly getMovieDetailsUseCase: GetMovieDetailsUseCase,
        private readonly filterMoviesUseCase: FilterMoviesUseCase,
        private readonly kkphimProvider: KKPhimMovieProvider,
    ) { }

    @Get('search')
    async searchMovies(
        @Query('q') query: string,
        @Query('page') page = 1,
    ) {
        const result = await this.searchMoviesUseCase.execute({ query, page: Number(page) });

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
     * Filter movies with multiple criteria
     * @param search - Search query
     * @param genres - Genre slugs (comma-separated)
     * @param countries - Country slugs (comma-separated)
     * @param yearFrom - Start year
     * @param yearTo - End year
     * @param qualities - Quality values (comma-separated)
     * @param languages - Language values (comma-separated)
     * @param status - Status values (comma-separated)
     * @param type - Movie type (phim-bo, phim-le, hoat-hinh, tv-shows)
     * @param page - Page number
     * @param limit - Items per page
     */
    @Get('filter')
    async filterMovies(
        @Query('search') search?: string,
        @Query('genres') genres?: string,
        @Query('countries') countries?: string,
        @Query('yearFrom') yearFrom?: string,
        @Query('yearTo') yearTo?: string,
        @Query('qualities') qualities?: string,
        @Query('languages') languages?: string,
        @Query('status') status?: string,
        @Query('type') type?: string,
        @Query('page') page = 1,
        @Query('limit') limit = 24,
    ) {
        const filters = {
            search: search || undefined,
            genres: genres ? genres.split(',').filter(Boolean) : undefined,
            countries: countries ? countries.split(',').filter(Boolean) : undefined,
            yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
            yearTo: yearTo ? parseInt(yearTo) : undefined,
            qualities: qualities ? qualities.split(',').filter(Boolean) : undefined,
            languages: languages ? languages.split(',').filter(Boolean) : undefined,
            status: status ? status.split(',').filter(Boolean) : undefined,
            type: type || undefined,
            page: Number(page),
            limit: Number(limit),
        };

        const result = await this.filterMoviesUseCase.execute(filters);

        if (result.isFailure) {
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        const { movies, total, page: currentPage, totalPages } = result.value;

        return {
            success: true,
            data: movies.map(this.toResponse),
            pagination: {
                total,
                page: currentPage,
                totalPages,
                limit: Number(limit),
            },
        };
    }

    @Get('popular')
    async getPopularMovies(
        @Query('page') page = 1,
        @Query('limit') limit = 24
    ) {
        const result = await this.getPopularMoviesUseCase.execute(Number(page));

        if (result.isFailure) {
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        const movies = result.value;
        const currentPage = Number(page);

        // TMDB popular movies have many pages (usually 500+)
        // We'll show pagination up to page 10 for performance
        const totalPages = currentPage < 10 ? currentPage + 1 : 10;

        return {
            success: true,
            data: movies.map(this.toResponse),
            pagination: {
                total: movies.length,
                page: currentPage,
                totalPages,
                limit: Number(limit),
            },
        };
    }

    @Get('top-rated')
    async getTopRatedMovies(@Query('page') page = 1) {
        const result = await this.getTopRatedMoviesUseCase.execute(Number(page));

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
        console.log('📡 [MovieController] Getting trending movies, timeWindow:', timeWindow);
        const result = await this.getTrendingMoviesUseCase.execute(timeWindow);

        if (result.isFailure) {
            console.error('❌ [MovieController] Trending movies failed:', result.error);
            throw new HttpException(
                result.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        console.log('✅ [MovieController] Trending movies count:', result.value.length);
        const response = {
            success: true,
            data: result.value.map(this.toResponse),
        };
        console.log('📤 [MovieController] Returning trending movies:', response.data.length);
        return response;
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
     * Get movies by type (phim-bo, phim-le, hoat-hinh, tv-shows)
     * @param type - Type slug (e.g., 'phim-bo', 'phim-le', 'hoat-hinh', 'tv-shows')
     * @param page - Page number (default: 1)
     */
    @Get('type/:type')
    async getMoviesByType(
        @Param('type') type: string,
        @Query('page') page = 1,
    ) {
        try {
            const movies = await this.kkphimProvider.getMoviesByType(type, Number(page));

            return {
                success: true,
                data: movies.map(this.toResponse),
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch movies by type',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
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
    async getMovieDetails(
        @Param('id') tmdbId: string,
        @Query('preview') preview?: string,
    ) {
        const isPreview = preview === 'true';
        const result = await this.getMovieDetailsUseCase.execute(tmdbId, { preview: isPreview });

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

        if (isPreview) {
            // Return simplified DTO for preview
            return {
                success: true,
                data: this.toPreviewResponse(movie),
            };
        }

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

    private toPreviewResponse(movie: any) {
        return {
            id: movie.id,
            externalId: movie.externalId,
            title: movie.title,
            originalTitle: movie.originalTitle,
            posterUrl: movie.posterUrl,
            backdropUrl: movie.backdropUrl,
            trailerUrl: movie.trailerUrl,
            releaseDate: movie.releaseDate,
            duration: movie.duration,
            rating: movie.rating,
            genres: movie.genres,
            quality: movie.quality,
            episodeCurrent: movie.episodeCurrent,
            // Exclude description, cast, director, country, lang, sources
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

