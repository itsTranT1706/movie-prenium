import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { StreamingProviderPort, StreamSource, Episode } from '../../domain';

/**
 * KKPhim Streaming Adapter
 * 
 * Implements StreamingProviderPort for KKPhim API (phimapi.com)
 * Uses TMDB ID lookup: GET https://phimapi.com/tmdb/{type}/{id}
 */
@Injectable()
export class KKPhimStreamingAdapter implements StreamingProviderPort {
    readonly providerName = 'kkphim';
    private readonly logger = new Logger(KKPhimStreamingAdapter.name);
    private readonly baseUrl = 'https://phimapi.com';

    constructor(private readonly httpService: HttpService) { }

    /**
     * Get stream sources by TMDB ID
     * @param tmdbId - TMDB movie/series ID
     * @param mediaType - 'movie' for phim lẻ, 'tv' for phim bộ/hoạt hình/TV shows
     */
    async getStreamSources(tmdbId: string, mediaType: 'movie' | 'tv'): Promise<StreamSource[] | null> {
        try {
            // GET https://phimapi.com/tmdb/{type}/{id}
            const url = `${this.baseUrl}/tmdb/${mediaType}/${tmdbId}`;
            this.logger.debug(`Fetching from KKPhim: ${url}`);

            const response = await this.httpService.axiosRef.get(url);

            if (!response.data?.status || !response.data?.episodes) {
                this.logger.debug(`No episodes found for TMDB ${tmdbId}`);
                return null;
            }

            const { movie, episodes } = response.data;
            return this.mapToStreamSources(episodes, movie?.quality || 'HD');
        } catch (error) {
            this.logger.warn(`KKPhim lookup failed for TMDB ${tmdbId}: ${error.message}`);
            return null;
        }
    }

    /**
     * Map KKPhim API response to StreamSource array
     * 
     * KKPhim response structure:
     * episodes: [
     *   { server_name: "#Hà Nội (Vietsub)", server_data: [...] },
     *   { server_name: "#Hà Nội (Lồng Tiếng)", server_data: [...] }
     * ]
     */
    private mapToStreamSources(episodes: any[], quality: string): StreamSource[] {
        return episodes.map(server => {
            const mappedEpisodes = server.server_data.map((ep: any, index: number) =>
                Episode.create(uuidv4(), {
                    episodeNumber: this.parseEpisodeNumber(ep.name, index),
                    title: ep.name,
                    slug: ep.slug,
                    streamUrl: ep.link_m3u8 || '',
                    embedUrl: ep.link_embed || '',
                })
            );

            return StreamSource.create({
                provider: 'kkphim',
                serverName: server.server_name,
                quality,
                language: this.parseLanguage(server.server_name),
                episodes: mappedEpisodes,
            });
        });
    }

    /**
     * Parse episode number from title like "Tập 01" or "1"
     */
    private parseEpisodeNumber(name: string, fallbackIndex: number): number {
        const match = name.match(/\d+/);
        return match ? parseInt(match[0], 10) : fallbackIndex + 1;
    }

    /**
     * Parse language from server name
     * Examples: "#Hà Nội (Vietsub)", "#Hà Nội (Lồng Tiếng)", "#Hà Nội (Thuyết Minh)"
     */
    private parseLanguage(serverName: string): string {
        if (serverName.includes('Vietsub')) return 'Vietsub';
        if (serverName.includes('Thuyết Minh')) return 'Thuyết Minh';
        if (serverName.includes('Lồng Tiếng')) return 'Lồng Tiếng';
        return 'Unknown';
    }
}
