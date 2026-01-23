import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Movie, MovieProviderPort } from '../../domain';
import { TMDBApiClient, TMDBMovie, TMDBTVShow, TMDBConfigService } from '@/shared/infrastructure/tmdb';

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
            const [movie, trailerUrl] = await Promise.all([
                this.tmdbClient.getMovieDetails(externalId),
                this.tmdbClient.getTrailerUrl(externalId),
            ]);
            return this.mapToMovie(movie, true, trailerUrl);
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
            const [tvShow, trailerUrl] = await Promise.all([
                this.tmdbClient.getTVShowDetails(externalId),
                this.tmdbClient.getTVTrailerUrl(externalId),
            ]);
            return this.mapTVShowToMovie(tvShow, trailerUrl);
        } catch (error) {
            this.logger.error(`Failed to get TV show details: ${error}`);
            return null;
        }
    }

    /**
     * Get popular movies
     */
    async getPopularMovies(page = 1): Promise<Movie[]> {
        this.logger.log(`Getting popular movies, page: ${page}`);

        try {
            const response = await this.tmdbClient.getPopularMovies(page);
            return response.results.map((movie) => this.mapToMovie(movie));
        } catch (error) {
            this.logger.error(`Failed to get popular movies: ${error}`);
            return [];
        }
    }

    /**
     * Get top rated movies
     */
    async getTopRatedMovies(page = 1): Promise<Movie[]> {
        this.logger.log(`Getting top rated movies, page: ${page}`);

        try {
            const response = await this.tmdbClient.getTopRatedMovies(page);
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
     */
    async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
        this.logger.log(`Getting trending movies: ${timeWindow}`);

        try {
            const response = await this.tmdbClient.getTrendingMovies(timeWindow);
            return response.results.map((movie) => this.mapToMovie(movie));
        } catch (error) {
            this.logger.error(`Failed to get trending movies: ${error}`);
            return [];
        }
    }

    /**
     * Get upcoming movies
     */
    async getUpcomingMovies(page = 1): Promise<Movie[]> {
        this.logger.log(`Getting upcoming movies, page: ${page}`);

        try {
            const response = await this.tmdbClient.getUpcomingMovies(page);
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
        mediaType: 'movie' | 'tv' = 'movie'
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
}
