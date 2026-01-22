import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Movie, MovieProviderPort } from '../../domain';
import { TMDBApiClient, TMDBMovie, TMDBConfigService } from '@/shared/infrastructure/tmdb';

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
}
