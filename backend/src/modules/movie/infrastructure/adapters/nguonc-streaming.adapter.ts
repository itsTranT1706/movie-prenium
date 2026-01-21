import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { StreamingProviderPort, StreamSource, Episode } from '../../domain';

/**
 * NguonC Streaming Adapter
 * 
 * Implements StreamingProviderPort for NguonC API (phim.nguonc.com)
 * Uses title search as fallback: GET https://phim.nguonc.com/api/films/search?keyword={name}
 */
@Injectable()
export class NguonCStreamingAdapter implements StreamingProviderPort {
    readonly providerName = 'nguonc';
    private readonly logger = new Logger(NguonCStreamingAdapter.name);
    private readonly baseUrl = 'https://phim.nguonc.com/api';

    constructor(private readonly httpService: HttpService) { }

    /**
     * NguonC doesn't support TMDB ID lookup directly
     * Returns null - use searchByTitle instead
     */
    async getStreamSources(tmdbId: string, mediaType: 'movie' | 'tv'): Promise<StreamSource[] | null> {
        this.logger.debug('NguonC requires searchByTitle - TMDB lookup not supported');
        return null;
    }

    /**
     * Search by original title (English name)
     * @param originalName - Original movie/series name (e.g., "All of Us Are Dead")
     */
    async searchByTitle(originalName: string): Promise<StreamSource[] | null> {
        try {
            // Step 1: Search by keyword
            const searchUrl = `${this.baseUrl}/films/search?keyword=${encodeURIComponent(originalName)}`;
            this.logger.debug(`Searching NguonC: ${searchUrl}`);

            const searchResponse = await this.httpService.axiosRef.get(searchUrl);

            if (!searchResponse.data?.items?.length) {
                this.logger.debug(`No results found for "${originalName}"`);
                return null;
            }

            // Step 2: Find best match by original_name (case-insensitive)
            const match = searchResponse.data.items.find(
                (item: any) => item.original_name?.toLowerCase() === originalName.toLowerCase()
            );

            if (!match) {
                this.logger.debug(`No exact match found for "${originalName}"`);
                return null;
            }

            // Step 3: Get full movie details with episodes
            const detailUrl = `${this.baseUrl}/film/${match.slug}`;
            this.logger.debug(`Fetching details: ${detailUrl}`);

            const detailResponse = await this.httpService.axiosRef.get(detailUrl);

            if (!detailResponse.data?.movie?.episodes) {
                this.logger.debug(`No episodes found for "${match.slug}"`);
                return null;
            }

            const { movie } = detailResponse.data;
            return this.mapToStreamSources(movie.episodes, movie.quality || 'HD');
        } catch (error) {
            this.logger.warn(`NguonC search failed for "${originalName}": ${error.message}`);
            return null;
        }
    }

    /**
     * Map NguonC API response to StreamSource array
     * 
     * NguonC response structure:
     * episodes: [
     *   { server_name: "Vietsub #1", items: [...] },
     *   { server_name: "Lồng Tiếng #1", items: [...] }
     * ]
     */
    private mapToStreamSources(episodes: any[], quality: string): StreamSource[] {
        return episodes.map(server => {
            const mappedEpisodes = server.items.map((ep: any, index: number) =>
                Episode.create(uuidv4(), {
                    episodeNumber: this.parseEpisodeNumber(ep.name, index),
                    title: ep.name,
                    slug: ep.slug,
                    streamUrl: ep.m3u8 || '',
                    embedUrl: ep.embed || '',
                })
            );

            return StreamSource.create({
                provider: 'nguonc',
                serverName: server.server_name,
                quality,
                language: this.parseLanguage(server.server_name),
                episodes: mappedEpisodes,
            });
        });
    }

    /**
     * Parse episode number from title like "1", "2", etc.
     */
    private parseEpisodeNumber(name: string, fallbackIndex: number): number {
        const match = name.match(/\d+/);
        return match ? parseInt(match[0], 10) : fallbackIndex + 1;
    }

    /**
     * Parse language from server name
     * Examples: "Vietsub #1", "Lồng Tiếng #1"
     */
    private parseLanguage(serverName: string): string {
        if (serverName.includes('Vietsub')) return 'Vietsub';
        if (serverName.includes('Thuyết Minh')) return 'Thuyết Minh';
        if (serverName.includes('Lồng Tiếng')) return 'Lồng Tiếng';
        return 'Unknown';
    }
}
