import { Injectable, Logger } from '@nestjs/common';
import { Movie, MovieProviderPort } from '../../domain';

/**
 * Stub Movie Provider Adapter
 * 
 * This is a PLACEHOLDER implementation for development.
 * 
 * FUTURE IMPLEMENTATIONS:
 * - TMDBMovieProvider: Integrates with The Movie Database API
 * - OMDBMovieProvider: Integrates with Open Movie Database API
 * - SelfHostedMovieProvider: Local movie database
 * 
 * Each new provider just implements MovieProviderPort interface
 */
@Injectable()
export class StubMovieProvider implements MovieProviderPort {
    private readonly logger = new Logger(StubMovieProvider.name);

    async searchMovies(query: string): Promise<Movie[]> {
        this.logger.log(`[STUB] Searching movies: ${query}`);
        // TODO: Replace with actual provider implementation
        return [];
    }

    async getMovieDetails(externalId: string): Promise<Movie | null> {
        this.logger.log(`[STUB] Getting movie details: ${externalId}`);
        // TODO: Replace with actual provider implementation
        return null;
    }

    async getPopularMovies(page = 1): Promise<Movie[]> {
        this.logger.log(`[STUB] Getting popular movies, page: ${page}`);
        // TODO: Replace with actual provider implementation
        return [];
    }

    async getMoviesByGenre(genre: string, page = 1): Promise<Movie[]> {
        this.logger.log(`[STUB] Getting movies by genre: ${genre}, page: ${page}`);
        // TODO: Replace with actual provider implementation
        return [];
    }
}
