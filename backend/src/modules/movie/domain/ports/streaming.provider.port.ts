import { StreamSource } from '../entities/stream-source.entity';

/**
 * Streaming Provider Port - Abstraction for streaming sources
 * 
 * TODAY: KKPhim, NguonC
 * TOMORROW: VieON, FPT Play, etc.
 * 
 * Providers are registered in StreamingProviderRegistry
 */
export interface StreamingProviderPort {
    readonly providerName: string;

    /**
     * Get stream sources by TMDB ID
     * @param tmdbId - TMDB movie/series ID
     * @param mediaType - 'movie' or 'tv' (required for KKPhim)
     * @returns Array of stream sources or null if not found
     */
    getStreamSources(tmdbId: string, mediaType: 'movie' | 'tv'): Promise<StreamSource[] | null>;

    /**
     * Fallback: Search by original title (for providers without TMDB ID support)
     * @param originalName - Original movie/series name in English
     * @returns Array of stream sources or null if not found
     */
    searchByTitle?(originalName: string): Promise<StreamSource[] | null>;
}
