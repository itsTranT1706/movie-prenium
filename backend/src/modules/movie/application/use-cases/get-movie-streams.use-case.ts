import { Injectable, Logger } from '@nestjs/common';
import { StreamSource } from '../../domain';
import { StreamingProviderRegistry } from '../../infrastructure/adapters';

/**
 * Get Movie Streams Use Case
 * 
 * Fetches stream sources from all registered streaming providers.
 * Uses TMDB ID for lookup, with fallback to title search for providers
 * that don't support TMDB ID (like NguonC).
 */
@Injectable()
export class GetMovieStreamsUseCase {
    private readonly logger = new Logger(GetMovieStreamsUseCase.name);

    constructor(
        private readonly providerRegistry: StreamingProviderRegistry,
    ) { }

    /**
     * Execute the use case
     * @param tmdbId - TMDB movie/series ID
     * @param mediaType - 'movie' for phim lẻ, 'tv' for phim bộ
     * @param originalName - Optional original title for fallback search
     * @returns Array of stream sources from all providers
     */
    async execute(
        tmdbId: string,
        mediaType: 'movie' | 'tv',
        originalName?: string
    ): Promise<StreamSource[]> {
        const allSources: StreamSource[] = [];
        const providers = this.providerRegistry.getProviders();

        this.logger.log(`Fetching streams for TMDB ${tmdbId} (${mediaType})`);

        // Try each provider in parallel
        const results = await Promise.allSettled(
            providers.map(async (provider) => {
                this.logger.debug(`Trying provider: ${provider.providerName}`);

                // First try TMDB ID lookup
                let sources = await provider.getStreamSources(tmdbId, mediaType);

                // If no results and originalName provided, try title search (fallback)
                if (!sources && originalName && provider.searchByTitle) {
                    this.logger.debug(`Fallback to title search for ${provider.providerName}`);
                    sources = await provider.searchByTitle(originalName);
                }

                return { provider: provider.providerName, sources };
            })
        );

        // Collect successful results
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.sources) {
                this.logger.log(`Found ${result.value.sources.length} sources from ${result.value.provider}`);
                allSources.push(...result.value.sources);
            }
        }

        this.logger.log(`Total stream sources found: ${allSources.length}`);
        return allSources;
    }
}
