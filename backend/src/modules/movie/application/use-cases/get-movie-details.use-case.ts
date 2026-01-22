import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { MovieDetailResult, MOVIE_PROVIDER, MovieProviderPort, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';
import { StreamingProviderRegistry } from '../../infrastructure/adapters';
import { TMDBNotFoundError, TMDBRateLimitError, TMDBApiError } from '@/shared/infrastructure/tmdb';

/**
 * Get Movie Details Use Case
 * 
 * Implements cache-first strategy with error handling:
 * 1. Check cache using findByExternalIdWithCache
 * 2. If cache miss, fetch from TMDB provider
 * 3. Save to repository
 * 4. On TMDB errors, fallback to stale cache if available
 * 5. Fetch streaming sources from KKPhim (on-demand)
 * 6. Merge metadata and streaming sources
 * 
 * Requirements: 2.2, 2.3, 4.1, 4.3, 4.4, 6.5, 8.1, 8.3, 8.4
 */
@Injectable()
export class GetMovieDetailsUseCase {
    private readonly logger = new Logger(GetMovieDetailsUseCase.name);

    constructor(
        @Inject(MOVIE_PROVIDER)
        private readonly movieProvider: MovieProviderPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
        private readonly streamingRegistry: StreamingProviderRegistry,
    ) { }

    async execute(tmdbId: string): Promise<Result<MovieDetailResult | null>> {
        try {
            // 1. Check cache first
            let movie = await this.movieRepository.findByExternalIdWithCache(tmdbId);

            // 2. If not cached, stale, or missing trailer, fetch from TMDB
            // This ensures we always have complete data including trailer
            if (!movie || !movie.trailerUrl) {
                try {
                    const freshMovie = await this.movieProvider.getMovieDetails(tmdbId);
                    if (!freshMovie) {
                        // If TMDB fetch fails but we have cached data, use it
                        if (movie) {
                            this.logger.warn(`TMDB returned null for ${tmdbId}, using cached data`);
                        } else {
                            return Result.fail(new Error('Movie not found'));
                        }
                    } else {
                        movie = freshMovie;
                        // 3. Cache it (will merge with existing data)
                        await this.movieRepository.save(movie);
                    }
                } catch (error) {
                    // Handle TMDB API errors with cache fallback
                    if (error instanceof TMDBNotFoundError) {
                        this.logger.warn(`Movie not found in TMDB: ${tmdbId}`);
                        return Result.fail(new Error('Movie not found'));
                    }
                    
                    if (error instanceof TMDBRateLimitError) {
                        this.logger.warn(`TMDB rate limit exceeded. Retry after: ${error.retryAfter || 'unknown'} seconds`);
                        // Try to serve from stale cache
                        const staleMovie = await this.movieRepository.findByExternalId(tmdbId);
                        if (staleMovie) {
                            this.logger.log(`Serving stale cache for ${tmdbId} due to rate limit`);
                            movie = staleMovie;
                        } else {
                            return Result.fail(new Error('Too many requests. Please try again later.'));
                        }
                    } else if (error instanceof TMDBApiError) {
                        this.logger.error(`TMDB API error (${error.statusCode}): ${error.message}`);
                        // Try to serve from stale cache
                        const staleMovie = await this.movieRepository.findByExternalId(tmdbId);
                        if (staleMovie) {
                            this.logger.log(`Serving stale cache for ${tmdbId} due to TMDB error`);
                            movie = staleMovie;
                        } else {
                            return Result.fail(new Error('Failed to fetch movie details'));
                        }
                    } else {
                        // Unknown error - try cache fallback
                        this.logger.error(`Unexpected error fetching movie: ${error}`);
                        const staleMovie = await this.movieRepository.findByExternalId(tmdbId);
                        if (staleMovie) {
                            this.logger.log(`Serving stale cache for ${tmdbId} due to unexpected error`);
                            movie = staleMovie;
                        } else {
                            throw error;
                        }
                    }
                }
            }

            // If we still don't have a movie, fail
            if (!movie) {
                return Result.fail(new Error('Movie not found'));
            }

            // 4. Fetch streaming sources from KKPhim (on-demand, not cached)
            // Graceful degradation - streaming errors should not fail the whole request
            let sources: any[] = [];
            try {
                const kkphimAdapter = this.streamingRegistry.getProviderByName('kkphim');
                if (kkphimAdapter) {
                    const streamSources = await kkphimAdapter.getStreamSources(tmdbId, movie.mediaType);
                    sources = streamSources || [];
                } else {
                    this.logger.warn('KKPhim streaming adapter not available');
                }
            } catch (error) {
                // Log warning but don't fail - streaming is optional
                this.logger.warn(`Failed to fetch streaming sources for ${tmdbId}: ${error.message}`);
                sources = [];
            }

            // 5. Merge metadata and streaming sources
            return Result.ok({
                movie,
                sources,
            });
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
