import { Movie } from '../entities/movie.entity';
import { ActorProfileDTO } from '../../application/dtos/actor-profile.dto';

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
    getTopRatedMovies(page?: number): Promise<Movie[]>;
    getMoviesByGenre(genre: string, page?: number): Promise<Movie[]>;
    getTrendingMovies(timeWindow?: 'day' | 'week'): Promise<Movie[]>;
    getUpcomingMovies(page?: number): Promise<Movie[]>;
    getCinemaMovies?(page?: number, limit?: number): Promise<Movie[]>;
    getMovieCast?(id: string): Promise<any[]>;
    getMoviesByActor?(actorId: string): Promise<Movie[]>;
    getActorProfile?(actorId: string): Promise<any | null>;
}

export const MOVIE_PROVIDER = Symbol('MOVIE_PROVIDER');
