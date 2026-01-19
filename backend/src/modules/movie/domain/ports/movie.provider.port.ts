import { Movie } from '../entities/movie.entity';

/**
 * Movie Provider Port - Abstraction for external movie APIs
 * 
 * TODAY: TMDB, OMDB, or other third-party APIs
 * TOMORROW: Self-hosted movie database
 * 
 * This port ensures we are PROVIDER-AGNOSTIC
 */
export interface MovieProviderPort {
    searchMovies(query: string): Promise<Movie[]>;
    getMovieDetails(externalId: string): Promise<Movie | null>;
    getPopularMovies(page?: number): Promise<Movie[]>;
    getMoviesByGenre(genre: string, page?: number): Promise<Movie[]>;
}

export const MOVIE_PROVIDER = Symbol('MOVIE_PROVIDER');
