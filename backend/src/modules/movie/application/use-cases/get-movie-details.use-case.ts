import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '@/shared/domain';
import { Movie, MovieDetailResult, MOVIE_PROVIDER, MovieProviderPort, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';
import { StreamingProviderRegistry, KKPhimMovieProvider } from '../../infrastructure/adapters';
import { TMDBNotFoundError, TMDBRateLimitError, TMDBApiError } from '@/shared/infrastructure/tmdb';

/**
 * Get Movie Details Use Case
 * 
 * Implements cache-first strategy with error handling:
 * 1. Detect if input is TMDB ID (numeric) or slug (non-numeric)
 * 2. For slugs: Use KKPhim directly to get movie with episodes
 * 3. For TMDB IDs: Check cache, fetch from TMDB, then get streaming from KKPhim
 * 4. On errors, fallback to stale cache if available
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
        private readonly kkphimProvider: KKPhimMovieProvider,
    ) { }

    /**
     * Check if the given identifier is a TMDB ID (numeric string) or a slug
     * TMDB IDs are always numeric (e.g., "123456")
     * Slugs contain letters/hyphens (e.g., "nguoi-lac-truyen")
     */
    private isTmdbId(identifier: string): boolean {
        return /^\d+$/.test(identifier);
    }

    async execute(identifier: string): Promise<Result<MovieDetailResult | null>> {
        // Route to appropriate handler based on identifier type
        if (this.isTmdbId(identifier)) {
            return this.executeWithTmdb(identifier);
        } else {
            return this.executeWithSlug(identifier);
        }
    }

    /**
     * Handle movie details request using slug (KKPhim direct lookup)
     * This is used when movies don't have a TMDB ID
     */
    private async executeWithSlug(slug: string): Promise<Result<MovieDetailResult | null>> {
        try {
            this.logger.debug(`Fetching movie by slug: ${slug}`);

            // Use KKPhim's getMovieWithEpisodes which returns both metadata and sources
            const result = await this.kkphimProvider.getMovieWithEpisodes(slug);

            if (!result) {
                return Result.fail(new Error('Movie not found'));
            }

            let { movie } = result;

            // If movie has TMDB ID but no trailer, try to fetch trailer from TMDB
            // KKPhim stores TMDB ID in externalId when available (numeric value)
            if (!movie.trailerUrl && movie.externalId && /^\d+$/.test(movie.externalId)) {
                this.logger.debug(`Fetching trailer from TMDB for ${movie.title} (ID: ${movie.externalId}, type: ${movie.mediaType})`);
                try {
                    let trailerUrl: string | undefined;
                    if (movie.mediaType === 'tv') {
                        trailerUrl = await (this.movieProvider as any).tmdbClient?.getTVTrailerUrl?.(movie.externalId);
                    } else {
                        trailerUrl = await (this.movieProvider as any).tmdbClient?.getTrailerUrl?.(movie.externalId);
                    }

                    if (trailerUrl) {
                        this.logger.debug(`Found TMDB trailer for ${movie.title}: ${trailerUrl}`);
                        // Update movie with trailer - create new Movie with explicit props
                        movie = Movie.create(movie.id, {
                            externalId: movie.externalId,
                            slug: movie.slug,
                            title: movie.title,
                            originalTitle: movie.originalTitle,
                            mediaType: movie.mediaType,
                            description: movie.description,
                            posterUrl: movie.posterUrl,
                            backdropUrl: movie.backdropUrl,
                            trailerUrl, // Updated trailer
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
                            imdbId: movie.imdbId,
                            originalLanguage: movie.originalLanguage,
                            provider: movie.provider,
                            streamUrl: movie.streamUrl,
                            createdAt: movie.createdAt,
                            updatedAt: new Date(),
                        });
                    }
                } catch (e) {
                    this.logger.warn(`Failed to fetch TMDB trailer for ${movie.title}: ${e.message}`);
                }
            }

            // Cache the movie for future lookups
            await this.movieRepository.save(movie);

            return Result.ok({ movie, sources: result.sources });
        } catch (error) {
            this.logger.error(`Failed to fetch movie by slug ${slug}: ${error.message}`);
            return Result.fail(error as Error);
        }
    }

    /**
     * Handle movie details request using TMDB ID
     * Strategy:
     * 1. First, try to get movie from KKPhim by TMDB ID (includes trailer_url if available)
     * 2. If found in KKPhim with trailer, use it directly
     * 3. If no trailer from KKPhim, fetch from TMDB to get trailer
     * 4. Merge KKPhim metadata with TMDB trailer if needed
     */
    private async executeWithTmdb(tmdbId: string): Promise<Result<MovieDetailResult | null>> {
        try {
            // 1. Check cache first
            let movie = await this.movieRepository.findByExternalIdWithCache(tmdbId);
            let mediaType: 'movie' | 'tv' = movie?.mediaType || 'movie';
            let sources: any[] = [];
            let kkphimMovie: Movie | null = null;

            // 2. Try to get movie from KKPhim first (priority for trailer_url)
            const kkphimAdapter = this.streamingRegistry.getProviderByName('kkphim');
            if (kkphimAdapter) {
                try {
                    // Search KKPhim by TMDB ID - try both movie and TV
                    this.logger.debug(`Searching KKPhim for TMDB ID ${tmdbId}`);
                    
                    // Try movie first - use getMovieDetailsByTmdbId to get trailer_url
                    let kkphimResult = await (kkphimAdapter as any).getMovieDetailsByTmdbId?.(tmdbId, 'movie');
                    if (kkphimResult && kkphimResult.sources && kkphimResult.sources.length > 0) {
                        mediaType = 'movie';
                        sources = kkphimResult.sources;
                        this.logger.debug(`KKPhim found content as movie for TMDB ID ${tmdbId}`);
                        
                        // Map KKPhim API response to Movie entity
                        if (kkphimResult.movie) {
                            kkphimMovie = this.mapKKPhimApiToMovie(kkphimResult.movie, kkphimResult.trailerUrl);
                        }
                    } else {
                        // Try TV
                        kkphimResult = await (kkphimAdapter as any).getMovieDetailsByTmdbId?.(tmdbId, 'tv');
                        if (kkphimResult && kkphimResult.sources && kkphimResult.sources.length > 0) {
                            mediaType = 'tv';
                            sources = kkphimResult.sources;
                            this.logger.debug(`KKPhim found content as TV for TMDB ID ${tmdbId}`);
                            
                            // Map KKPhim API response to Movie entity
                            if (kkphimResult.movie) {
                                kkphimMovie = this.mapKKPhimApiToMovie(kkphimResult.movie, kkphimResult.trailerUrl);
                            }
                        }
                    }
                } catch (e) {
                    this.logger.debug(`KKPhim lookup failed: ${e.message}`);
                }
            }

            // 3. If KKPhim has the movie with trailer, use it
            if (kkphimMovie && kkphimMovie.trailerUrl) {
                this.logger.debug(`Using KKPhim movie with trailer for TMDB ID ${tmdbId}`);
                movie = kkphimMovie;
                await this.movieRepository.save(movie);
            } 
            // 4. If no trailer from KKPhim or no KKPhim data, fetch from TMDB
            else if (!movie || !movie.trailerUrl) {
                this.logger.debug(`Fetching from TMDB for ID ${tmdbId} (mediaType: ${mediaType})`);
                
                try {
                    let freshMovie: Movie | null = null;

                    // Fetch from correct TMDB endpoint based on mediaType
                    if (mediaType === 'tv') {
                        this.logger.debug(`Fetching TV show details from TMDB for ID ${tmdbId}`);
                        freshMovie = await (this.movieProvider as any).getTVShowDetails?.(tmdbId) || null;
                    }

                    // If not TV or TV fetch failed, try movie endpoint
                    if (!freshMovie) {
                        this.logger.debug(`Fetching movie details from TMDB for ID ${tmdbId}`);
                        freshMovie = await this.movieProvider.getMovieDetails(tmdbId);
                    }

                    if (!freshMovie) {
                        // If TMDB fetch fails but we have cached or KKPhim data, use it
                        if (movie || kkphimMovie) {
                            this.logger.warn(`TMDB returned null for ${tmdbId}, using existing data`);
                            movie = movie || kkphimMovie;
                        } else {
                            return Result.fail(new Error('Movie not found'));
                        }
                    } else {
                        // Merge TMDB data with KKPhim data if available
                        if (kkphimMovie) {
                            // Prefer KKPhim metadata but use TMDB trailer
                            movie = Movie.create(kkphimMovie.id, {
                                externalId: kkphimMovie.externalId,
                                slug: kkphimMovie.slug,
                                title: kkphimMovie.title,
                                originalTitle: kkphimMovie.originalTitle,
                                mediaType: kkphimMovie.mediaType,
                                description: kkphimMovie.description || freshMovie.description,
                                posterUrl: kkphimMovie.posterUrl || freshMovie.posterUrl,
                                backdropUrl: kkphimMovie.backdropUrl || freshMovie.backdropUrl,
                                trailerUrl: freshMovie.trailerUrl, // TMDB trailer
                                releaseDate: kkphimMovie.releaseDate || freshMovie.releaseDate,
                                duration: kkphimMovie.duration || freshMovie.duration,
                                rating: kkphimMovie.rating || freshMovie.rating,
                                genres: kkphimMovie.genres.length > 0 ? kkphimMovie.genres : freshMovie.genres,
                                cast: kkphimMovie.cast,
                                director: kkphimMovie.director,
                                country: kkphimMovie.country,
                                quality: kkphimMovie.quality,
                                lang: kkphimMovie.lang,
                                episodeCurrent: kkphimMovie.episodeCurrent,
                                imdbId: kkphimMovie.imdbId,
                                originalLanguage: kkphimMovie.originalLanguage,
                                provider: 'kkphim',
                                streamUrl: kkphimMovie.streamUrl,
                                createdAt: kkphimMovie.createdAt,
                                updatedAt: new Date(),
                            });
                        } else {
                            movie = freshMovie;
                        }
                        
                        // Cache it
                        await this.movieRepository.save(movie);
                    }
                } catch (error) {
                    // Handle TMDB API errors with cache fallback
                    if (error instanceof TMDBNotFoundError) {
                        // If movie not found, try TV endpoint
                        if (mediaType === 'movie') {
                            this.logger.debug(`Movie not found, trying TV endpoint for ${tmdbId}`);
                            try {
                                const tvMovie = await (this.movieProvider as any).getTVShowDetails?.(tmdbId);
                                if (tvMovie) {
                                    movie = tvMovie;
                                    await this.movieRepository.save(tvMovie);
                                } else if (kkphimMovie) {
                                    movie = kkphimMovie;
                                } else {
                                    return Result.fail(new Error('Movie not found'));
                                }
                            } catch {
                                if (kkphimMovie) {
                                    movie = kkphimMovie;
                                } else {
                                    return Result.fail(new Error('Movie not found'));
                                }
                            }
                        } else {
                            this.logger.warn(`Content not found in TMDB: ${tmdbId}`);
                            if (kkphimMovie) {
                                movie = kkphimMovie;
                            } else {
                                return Result.fail(new Error('Movie not found'));
                            }
                        }
                    } else if (error instanceof TMDBRateLimitError) {
                        this.logger.warn(`TMDB rate limit exceeded. Retry after: ${error.retryAfter || 'unknown'} seconds`);
                        const staleMovie = await this.movieRepository.findByExternalId(tmdbId);
                        if (staleMovie) {
                            this.logger.log(`Serving stale cache for ${tmdbId} due to rate limit`);
                            movie = staleMovie;
                        } else if (kkphimMovie) {
                            movie = kkphimMovie;
                        } else {
                            return Result.fail(new Error('Too many requests. Please try again later.'));
                        }
                    } else if (error instanceof TMDBApiError) {
                        this.logger.error(`TMDB API error (${error.statusCode}): ${error.message}`);
                        const staleMovie = await this.movieRepository.findByExternalId(tmdbId);
                        if (staleMovie) {
                            this.logger.log(`Serving stale cache for ${tmdbId} due to TMDB error`);
                            movie = staleMovie;
                        } else if (kkphimMovie) {
                            movie = kkphimMovie;
                        } else {
                            return Result.fail(new Error('Failed to fetch movie details'));
                        }
                    } else {
                        this.logger.error(`Unexpected error fetching movie: ${error}`);
                        const staleMovie = await this.movieRepository.findByExternalId(tmdbId);
                        if (staleMovie) {
                            this.logger.log(`Serving stale cache for ${tmdbId} due to unexpected error`);
                            movie = staleMovie;
                        } else if (kkphimMovie) {
                            movie = kkphimMovie;
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

            // 5. If we don't have sources yet, try to fetch them
            if (sources.length === 0 && kkphimAdapter) {
                try {
                    const streamSources = await kkphimAdapter.getStreamSources(tmdbId, movie.mediaType);
                    sources = streamSources || [];
                } catch (error) {
                    this.logger.warn(`Failed to fetch streaming sources for ${tmdbId}: ${error.message}`);
                }
            }

            // 6. Return merged result
            return Result.ok({
                movie,
                sources,
            });
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    /**
     * Helper method to find KKPhim slug by TMDB ID
     * This searches KKPhim's database for a movie with matching TMDB ID
     */
    private mapKKPhimApiToMovie(kkphimApiMovie: any, trailerUrl?: string): Movie {
        const now = new Date();
        
        // Determine mediaType from KKPhim type or tmdb.type
        let mediaType: 'movie' | 'tv' = 'movie';
        if (kkphimApiMovie.tmdb?.type) {
            mediaType = kkphimApiMovie.tmdb.type;
        } else if (['series', 'hoathinh', 'tvshows'].includes(kkphimApiMovie.type)) {
            mediaType = 'tv';
        }

        // Extract genres from category array
        const genres = kkphimApiMovie.category?.map((cat: any) => cat.name) || [];

        // Extract countries
        const country = kkphimApiMovie.country?.map((c: any) => c.name) || [];

        // Build full image URLs
        const cdnUrl = 'https://phimimg.com';
        const posterUrl = this.buildImageUrl(kkphimApiMovie.poster_url, cdnUrl);
        const backdropUrl = this.buildImageUrl(kkphimApiMovie.thumb_url, cdnUrl);

        return Movie.create(uuidv4(), {
            externalId: kkphimApiMovie.tmdb?.id || kkphimApiMovie.slug,
            slug: kkphimApiMovie.slug,
            title: kkphimApiMovie.name,
            originalTitle: kkphimApiMovie.origin_name,
            mediaType,
            description: kkphimApiMovie.content || undefined,
            posterUrl,
            backdropUrl,
            trailerUrl,
            releaseDate: kkphimApiMovie.year ? new Date(kkphimApiMovie.year, 0, 1) : undefined,
            duration: this.parseDuration(kkphimApiMovie.time),
            rating: kkphimApiMovie.tmdb?.vote_average || undefined,
            genres,
            cast: kkphimApiMovie.actor,
            director: kkphimApiMovie.director,
            country,
            quality: kkphimApiMovie.quality,
            lang: kkphimApiMovie.lang,
            episodeCurrent: kkphimApiMovie.episode_current,
            provider: 'kkphim',
            streamUrl: undefined,
            createdAt: now,
            updatedAt: kkphimApiMovie.modified?.time ? new Date(kkphimApiMovie.modified.time) : now,
        });
    }

    /**
     * Build full image URL from path
     */
    private buildImageUrl(path: string | undefined, cdnUrl: string): string | undefined {
        if (!path) return undefined;
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `${cdnUrl}/${cleanPath}`;
    }

    /**
     * Parse duration from string like "60 phút/tập" or "120 phút"
     */
    private parseDuration(timeStr?: string): number | undefined {
        if (!timeStr) return undefined;
        const match = timeStr.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : undefined;
    }
}

