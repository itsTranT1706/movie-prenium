import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Movie, MovieProviderPort } from '../../domain';
import { MovieCastDTO } from '../../application/dtos/movie-cast.dto';
import { TMDBApiClient, TMDBMovie, TMDBTVShow, TMDBConfigService, TMDBImagesResponse } from '@/shared/infrastructure/tmdb';

/**
 * TMDB Movie Provider Adapter
 * 
 * Implements MovieProviderPort using The Movie Database API.
 * This adapter translates between TMDB's data format and our domain entities.
 */
@Injectable()
export class TMDBMovieProvider implements MovieProviderPort {
    private readonly logger = new Logger(TMDBMovieProvider.name);

    constructor(
        private readonly tmdbClient: TMDBApiClient,
        private readonly tmdbConfig: TMDBConfigService,
    ) { }

    /**
     * Search movies by query string
     */
    async searchMovies(query: string): Promise<Movie[]> {
        this.logger.log(`Searching movies: ${query}`);

        try {
            const response = await this.tmdbClient.searchMovies(query);
            return response.results.map((movie) => this.mapToMovie(movie));
        } catch (error) {
            this.logger.error(`Failed to search movies: ${error}`);
            return [];
        }
    }

    /**
     * Get movie details by external ID (TMDB ID)
     */
    async getMovieDetails(externalId: string): Promise<Movie | null> {
        this.logger.log(`Getting movie details: ${externalId}`);

        try {
            const [movie, trailerUrl, images] = await Promise.all([
                this.tmdbClient.getMovieDetails(externalId),
                this.tmdbClient.getTrailerUrl(externalId),
                this.tmdbClient.getMovieImages(externalId),
            ]);
            return this.mapToMovie(movie, true, trailerUrl, 'movie', images);
        } catch (error) {
            this.logger.error(`Failed to get movie details: ${error}`);
            return null;
        }
    }

    /**
     * Get TV show details by external ID (TMDB ID)
     * Used when mediaType is 'tv' to fetch from TMDB's TV endpoint
     */
    async getTVShowDetails(externalId: string): Promise<Movie | null> {
        this.logger.log(`Getting TV show details: ${externalId}`);

        try {
            const [tvShow, trailerUrl, images] = await Promise.all([
                this.tmdbClient.getTVShowDetails(externalId),
                this.tmdbClient.getTVTrailerUrl(externalId),
                this.tmdbClient.getTVShowImages(externalId),
            ]);
            return this.mapTVShowToMovie(tvShow, trailerUrl, images);
        } catch (error) {
            this.logger.error(`Failed to get TV show details: ${error}`);
            return null;
        }
    }

    /**
     * Get popular movies with retry logic
     * First 6 movies are enriched with logo data for Hero Banner
     */
    async getPopularMovies(page = 1): Promise<Movie[]> {
        this.logger.log(`Getting popular movies, page: ${page}`);

        const maxRetries = 3;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.tmdbClient.getPopularMovies(page);

                if (!response || !response.results || response.results.length === 0) {
                    this.logger.warn(`Empty response from TMDB for popular movies, page: ${page}`);
                    if (attempt < maxRetries) {
                        await this.delay(1000 * attempt); // Exponential backoff
                        continue;
                    }
                    return [];
                }

                // Enrich first 6 movies with logo data for Hero Banner (only on page 1)
                const HERO_BANNER_COUNT = 6;
                const movies: Movie[] = [];

                for (let i = 0; i < response.results.length; i++) {
                    const tmdbMovie = response.results[i];

                    // Only fetch images for first 6 movies on page 1
                    if (page === 1 && i < HERO_BANNER_COUNT) {
                        try {
                            const images = await this.tmdbClient.getMovieImages(tmdbMovie.id);
                            movies.push(this.mapToMovie(tmdbMovie, false, undefined, 'movie', images));
                        } catch (imgError) {
                            this.logger.warn(`Failed to fetch images for movie ${tmdbMovie.id}: ${imgError}`);
                            movies.push(this.mapToMovie(tmdbMovie));
                        }
                    } else {
                        movies.push(this.mapToMovie(tmdbMovie));
                    }
                }

                return movies;
            } catch (error) {
                lastError = error as Error;
                this.logger.error(`Failed to get popular movies (attempt ${attempt}/${maxRetries}): ${error}`);

                if (attempt < maxRetries) {
                    await this.delay(1000 * attempt); // Wait before retry
                }
            }
        }

        this.logger.error(`All retries failed for popular movies: ${lastError?.message}`);
        return [];
    }

    /**
     * Delay helper for retry logic
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Enrich first N movies with logo data from TMDB images API
     */
    private async enrichWithLogos(tmdbMovies: any[], count = 10): Promise<Movie[]> {
        const movies: Movie[] = [];

        for (let i = 0; i < tmdbMovies.length; i++) {
            const tmdbMovie = tmdbMovies[i];

            // Only fetch images for first N movies
            if (i < count) {
                try {
                    const images = await this.tmdbClient.getMovieImages(tmdbMovie.id);
                    movies.push(this.mapToMovie(tmdbMovie, false, undefined, 'movie', images));
                } catch (imgError) {
                    this.logger.warn(`Failed to fetch images for movie ${tmdbMovie.id}: ${imgError}`);
                    movies.push(this.mapToMovie(tmdbMovie));
                }
            } else {
                movies.push(this.mapToMovie(tmdbMovie));
            }
        }

        return movies;
    }

    /**
     * Get top rated movies
     */
    async getTopRatedMovies(page = 1): Promise<Movie[]> {
        this.logger.log(`Getting top rated movies, page: ${page}`);

        try {
            const response = await this.tmdbClient.getTopRatedMovies(page);
            // Enrich first 6 movies with logos on page 1
            if (page === 1) {
                return this.enrichWithLogos(response.results, 10);
            }
            return response.results.map((movie) => this.mapToMovie(movie));
        } catch (error) {
            this.logger.error(`Failed to get top rated movies: ${error}`);
            return [];
        }
    }

    /**
     * Get movies by genre name
     */
    async getMoviesByGenre(genre: string, page = 1): Promise<Movie[]> {
        this.logger.log(`Getting movies by genre: ${genre}, page: ${page}`);

        try {
            // Convert genre name to TMDB genre ID
            const genreId = await this.tmdbClient.getGenreIdByName(genre);

            if (!genreId) {
                this.logger.warn(`Genre not found: ${genre}`);
                return [];
            }

            const response = await this.tmdbClient.discoverByGenre(genreId, page);
            return response.results.map((movie) => this.mapToMovie(movie));
        } catch (error) {
            this.logger.error(`Failed to get movies by genre: ${error}`);
            return [];
        }
    }

    /**
     * Get trending movies
     * First 6 movies are enriched with logo data for display
     */
    async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
        this.logger.log(`Getting trending movies: ${timeWindow}`);

        try {
            const response = await this.tmdbClient.getTrendingMovies(timeWindow);
            // Enrich first 6 movies with logos
            return this.enrichWithLogos(response.results, 10);
        } catch (error) {
            this.logger.error(`Failed to get trending movies: ${error}`);
            return [];
        }
    }

    /**
     * Get upcoming movies
     * First 6 movies are enriched with logo data on page 1
     */
    async getUpcomingMovies(page = 1): Promise<Movie[]> {
        this.logger.log(`Getting upcoming movies, page: ${page}`);

        try {
            const response = await this.tmdbClient.getUpcomingMovies(page);
            // Enrich first 6 movies with logos on page 1
            if (page === 1) {
                return this.enrichWithLogos(response.results, 10);
            }
            return response.results.map((movie) => this.mapToMovie(movie));
        } catch (error) {
            this.logger.error(`Failed to get upcoming movies: ${error}`);
            return [];
        }
    }

    /**
     * Map TMDB movie response to our Movie domain entity
     * @param mediaType - 'movie' for films, 'tv' for series (default: 'movie')
     */
    private mapToMovie(
        tmdbMovie: TMDBMovie,
        isDetailed = false,
        trailerUrl?: string,
        mediaType: 'movie' | 'tv' = 'movie',
        images?: TMDBImagesResponse
    ): Movie {
        const now = new Date();

        // Get genre names from IDs or use genre objects if available
        let genres: string[] = [];
        if (tmdbMovie.genres) {
            // Full movie details have genres as objects
            genres = tmdbMovie.genres.map((g) => g.name);
        } else if (tmdbMovie.genre_ids) {
            // Search results have genre_ids
            genres = this.tmdbClient.getGenreNames(tmdbMovie.genre_ids);
        }

        return Movie.create(uuidv4(), {
            externalId: String(tmdbMovie.id),
            title: tmdbMovie.title,
            originalTitle: tmdbMovie.original_title || undefined,
            mediaType,
            description: tmdbMovie.overview || undefined,
            posterUrl: this.tmdbConfig.getImageUrl(tmdbMovie.poster_path),
            backdropUrl: this.tmdbConfig.getImageUrl(tmdbMovie.backdrop_path, 'original'),
            logoUrl: images?.logos?.[0]?.file_path ? this.tmdbConfig.getImageUrl(images.logos[0].file_path, 'original') : undefined,
            backdrops: images?.backdrops?.map(b => this.tmdbConfig.getImageUrl(b.file_path, 'original') || '').filter(Boolean) || [],
            posters: images?.posters?.map(p => this.tmdbConfig.getImageUrl(p.file_path) || '').filter(Boolean) || [],
            trailerUrl,
            releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : undefined,
            duration: tmdbMovie.runtime || undefined,
            rating: tmdbMovie.vote_average || undefined,
            genres,
            provider: 'tmdb',
            streamUrl: undefined, // TMDB doesn't provide streaming URLs
            createdAt: now,
            updatedAt: now,
        });
    }

    /**
     * Map TMDB TV show response to our Movie domain entity
     */
    private mapTVShowToMovie(
        tvShow: TMDBTVShow,
        trailerUrl?: string,
        images?: TMDBImagesResponse
    ): Movie {
        const now = new Date();

        // Get genre names from IDs or use genre objects if available
        let genres: string[] = [];
        if (tvShow.genres) {
            genres = tvShow.genres.map((g) => g.name);
        } else if (tvShow.genre_ids) {
            genres = this.tmdbClient.getGenreNames(tvShow.genre_ids);
        }

        // Calculate average episode runtime
        const duration = tvShow.episode_run_time && tvShow.episode_run_time.length > 0
            ? Math.round(tvShow.episode_run_time.reduce((a, b) => a + b, 0) / tvShow.episode_run_time.length)
            : undefined;

        return Movie.create(uuidv4(), {
            externalId: String(tvShow.id),
            title: tvShow.name, // TV shows use 'name' instead of 'title'
            originalTitle: tvShow.original_name || undefined,
            mediaType: 'tv',
            description: tvShow.overview || undefined,
            posterUrl: this.tmdbConfig.getImageUrl(tvShow.poster_path),
            backdropUrl: this.tmdbConfig.getImageUrl(tvShow.backdrop_path, 'original'),
            logoUrl: images?.logos?.[0]?.file_path ? this.tmdbConfig.getImageUrl(images.logos[0].file_path, 'original') : undefined,
            backdrops: images?.backdrops?.map(b => this.tmdbConfig.getImageUrl(b.file_path, 'original') || '').filter(Boolean) || [],
            posters: images?.posters?.map(p => this.tmdbConfig.getImageUrl(p.file_path) || '').filter(Boolean) || [],
            trailerUrl,
            releaseDate: tvShow.first_air_date ? new Date(tvShow.first_air_date) : undefined,
            duration,
            rating: tvShow.vote_average || undefined,
            genres,
            provider: 'tmdb',
            streamUrl: undefined,
            createdAt: now,
            updatedAt: now,
        });
    }
    /**
     * Get movie cast (credits)
     */
    async getMovieCast(id: string): Promise<MovieCastDTO[]> {
        this.logger.log(`Getting cast for movie: ${id}`);
        try {
            const credits = await this.tmdbClient.getMovieCredits(id);
            const cast = credits.cast.map(c => new MovieCastDTO({
                id: c.id,
                name: c.name,
                originalName: c.original_name,
                character: c.character,
                profileUrl: this.tmdbConfig.getImageUrl(c.profile_path) || null,
                order: c.order
            }));
            return cast;
        } catch (error) {
            this.logger.error(`Failed to get movie cast: ${error}`);
            return [];
        }
    }

    /**
     * Get movies by actor
     */
    async getMoviesByActor(actorId: string): Promise<Movie[]> {
        this.logger.log(`Getting movies for actor: ${actorId}`);
        try {
            const response = await this.tmdbClient.getPersonMovieCredits(actorId);

            // Filter and map results
            const movies = response.cast
                .filter(item => item.poster_path && item.backdrop_path) // Only items with images
                .map(item => {
                    const now = new Date();

                    if (item.media_type === 'movie') {
                        return Movie.create(uuidv4(), {
                            externalId: String(item.id),
                            title: item.title,
                            originalTitle: item.original_title,
                            mediaType: 'movie',
                            description: item.overview,
                            posterUrl: this.tmdbConfig.getImageUrl(item.poster_path),
                            backdropUrl: this.tmdbConfig.getImageUrl(item.backdrop_path, 'original'),
                            releaseDate: item.release_date ? new Date(item.release_date) : undefined,
                            rating: item.vote_average,
                            genres: [], // We don't have genre names here easily without extra calls or map lookup
                            provider: 'tmdb',
                            createdAt: now,
                            updatedAt: now,
                        });
                    } else {
                        // TV Show
                        const tvItem = item as any; // Cast to any to access TV specific props safely
                        return Movie.create(uuidv4(), {
                            externalId: String(item.id),
                            title: tvItem.name,
                            originalTitle: tvItem.original_name,
                            mediaType: 'tv',
                            description: item.overview,
                            posterUrl: this.tmdbConfig.getImageUrl(item.poster_path),
                            backdropUrl: this.tmdbConfig.getImageUrl(item.backdrop_path, 'original'),
                            releaseDate: tvItem.first_air_date ? new Date(tvItem.first_air_date) : undefined,
                            rating: item.vote_average,
                            genres: [],
                            provider: 'tmdb',
                            createdAt: now,
                            updatedAt: now,
                        });
                    }
                });

            return movies;
        } catch (error) {
            this.logger.error(`Failed to get movies by actor: ${error}`);
            return [];
        }
    }

    /**
     * Get actor profile (details + movies)
     */
    async getActorProfile(actorId: string): Promise<any | null> {
        this.logger.log(`Getting actor profile: ${actorId}`);
        try {
            const [details, movies] = await Promise.all([
                this.tmdbClient.getPersonDetails(actorId),
                this.getMoviesByActor(actorId)
            ]);

            return {
                id: details.id,
                name: details.name,
                biography: details.biography,
                birthday: details.birthday,
                deathday: details.deathday,
                placeOfBirth: details.place_of_birth,
                profileUrl: this.tmdbConfig.getImageUrl(details.profile_path),
                knownForDepartment: details.known_for_department,
                movies: movies
            };
        } catch (error) {
            this.logger.error(`Failed to get actor profile: ${error}`);
            return null;
        }
    }
}
