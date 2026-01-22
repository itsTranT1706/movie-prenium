import { Injectable, Inject, Logger } from '@nestjs/common';
import { StreamSource, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';
import { StreamingProviderRegistry } from '../../infrastructure/adapters';
import { Result } from '@/shared/domain';

/**
 * Get Movie Streams Use Case
 * 
 * Fetches streaming sources from KKPhim for a specific movie.
 * Requires movie to exist in repository to determine mediaType.
 * Implements graceful error handling for streaming unavailability.
 * 
 * Requirements: 3.1, 3.3, 3.4, 8.2
 */
@Injectable()
export class GetMovieStreamsUseCase {
    private readonly logger = new Logger(GetMovieStreamsUseCase.name);

    constructor(
        private readonly streamingRegistry: StreamingProviderRegistry,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) {}

    /**
     * Execute the use case
     * @param tmdbId - TMDB movie/series ID
     * @returns Result with stream sources or error if unavailable
     */
    async execute(tmdbId: string): Promise<Result<StreamSource[]>> {
        try {
            // Get movie to determine mediaType
            const movie = await this.movieRepository.findByExternalId(tmdbId);
            if (!movie) {
                this.logger.warn(`Movie not found in repository: ${tmdbId}`);
                return Result.fail(new Error('Movie not found'));
            }

            // Fetch streaming sources from KKPhim
            const kkphimAdapter = this.streamingRegistry.getProviderByName('kkphim');
            if (!kkphimAdapter) {
                this.logger.warn('KKPhim streaming adapter not available');
                return Result.fail(new Error('Streaming provider not available'));
            }

            const sources = await kkphimAdapter.getStreamSources(tmdbId, movie.mediaType);

            if (!sources || sources.length === 0) {
                this.logger.debug(`No streaming sources found for ${tmdbId}`);
                return Result.fail(new Error('Streaming not available'));
            }

            return Result.ok(sources);
        } catch (error) {
            // Log error but return graceful failure message
            this.logger.warn(`Failed to fetch streaming sources for ${tmdbId}: ${error.message}`);
            return Result.fail(new Error('Streaming not available'));
        }
    }
}
