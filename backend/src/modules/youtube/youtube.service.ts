import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GetTrendingMoviesUseCase } from '../movie/application';

@Injectable()
export class YoutubeService {
    private readonly logger = new Logger(YoutubeService.name);
    private readonly apiKey: string;
    private readonly apiUrl = 'https://www.googleapis.com/youtube/v3/search';
    private readonly useOfficialApi: boolean;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly getTrendingMoviesUseCase: GetTrendingMoviesUseCase,
    ) {
        this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY') || '';
        this.useOfficialApi = !!this.apiKey;

        if (!this.useOfficialApi) {
            this.logger.warn('⚠️ YOUTUBE_API_KEY not configured. Using alternative method (no quota limits).');
        }
    }

    async getShorts(mode: 'random' | 'related' = 'random', query?: string) {
        let searchQuery = query;

        try {
            if (mode === 'random') {
                const result = await this.getTrendingMoviesUseCase.execute('week');
                if (result.isSuccess) {
                    const movies = result.value;
                    if (movies.length > 0) {
                        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                        // Mix of query types for variety
                        const suffixes = ['shorts', 'best scenes', 'funny moments', 'cast interview', 'edit', 'behind the scenes', 'trailer reaction', 'movie clips'];
                        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                        searchQuery = `${randomMovie.title} ${randomSuffix}`;
                        this.logger.log(`🎲 Random movie selected: ${randomMovie.title}, Query: ${searchQuery}`);
                    }
                }
            }

            if (!searchQuery) {
                // Fallback with more variety
                const keywords = [
                    "official trailer short",
                    "movie trailer shorts",
                    "new movie trailer short",
                    "teaser trailer shorts",
                    "final trailer short",
                ];
                searchQuery = keywords[Math.floor(Math.random() * keywords.length)];
            }

            return await this.searchYouTube(searchQuery);
        } catch (error) {
            this.logger.error('Error getting shorts:', error);
            // Fallback to alternative method if official API fails
            const fallbackQuery = searchQuery || 'movie shorts';
            if (this.useOfficialApi) {
                this.logger.warn('Falling back to alternative method...');
                return await this.searchYouTubeAlternative(fallbackQuery);
            }
            throw error;
        }
    }

    /**
     * Alternative method using YouTube's internal API (no quota limits)
     * This uses the same API that YouTube's website uses
     */
    private async searchYouTubeAlternative(query: string) {
        try {
            this.logger.log(`🔍 Searching YouTube (alternative method): "${query}"`);

            // Use YouTube's internal API endpoint
            const { data } = await firstValueFrom(
                this.httpService.post(
                    'https://www.youtube.com/youtubei/v1/search',
                    {
                        context: {
                            client: {
                                clientName: 'WEB',
                                clientVersion: '2.20240111.09.00',
                            },
                        },
                        query: query,
                        params: 'EgIYAQ%3D%3D', // Filter for shorts
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        },
                    }
                ),
            );

            const results: Array<{
                id: string;
                title: string;
                thumbnail: string;
                channelTitle: string;
                videoUrl: string;
                embedUrl: string;
            }> = [];
            const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

            for (const section of contents) {
                const items = section?.itemSectionRenderer?.contents || [];

                for (const item of items) {
                    const videoRenderer = item?.videoRenderer;
                    if (videoRenderer && videoRenderer.videoId) {
                        results.push({
                            id: videoRenderer.videoId,
                            title: videoRenderer.title?.runs?.[0]?.text || 'Untitled',
                            thumbnail: videoRenderer.thumbnail?.thumbnails?.[0]?.url || '',
                            channelTitle: videoRenderer.ownerText?.runs?.[0]?.text || 'Unknown',
                            videoUrl: `https://www.youtube.com/shorts/${videoRenderer.videoId}`,
                            embedUrl: `https://www.youtube.com/embed/${videoRenderer.videoId}`,
                        });

                        if (results.length >= 50) break;
                    }
                }
                if (results.length >= 50) break;
            }

            this.logger.log(`✅ Found ${results.length} shorts using alternative method`);

            // Shuffle results for variety
            return results.sort(() => Math.random() - 0.5);
        } catch (error: any) {
            this.logger.error('Error with alternative YouTube search:', error.message);
            throw new Error('Failed to fetch YouTube shorts. Please try again later.');
        }
    }

    private async searchYouTube(query: string) {
        // If not using official API, use alternative method
        if (!this.useOfficialApi) {
            return this.searchYouTubeAlternative(query);
        }

        try {
            const { data } = await firstValueFrom(
                this.httpService.get(this.apiUrl, {
                    params: {
                        part: 'snippet,id',
                        q: query,
                        type: 'video',
                        videoDuration: 'short',
                        maxResults: 50,
                        key: this.apiKey,
                        order: 'relevance',
                    },
                }),
            );

            const results = data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high.url,
                channelTitle: item.snippet.channelTitle,
                videoUrl: `https://www.youtube.com/shorts/${item.id.videoId}`,
                embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
            }));

            return results.sort(() => Math.random() - 0.5);
        } catch (error: any) {
            if (error.response?.data?.error?.details?.[0]?.reason === 'API_KEY_SERVICE_BLOCKED') {
                this.logger.error('❌ YouTube Data API v3 is not enabled. Switching to alternative method...');
                return this.searchYouTubeAlternative(query);
            }

            if (error.response?.status === 403) {
                this.logger.error('⚠️ YouTube API Quota Exceeded or Forbidden. Switching to alternative method...');
                return this.searchYouTubeAlternative(query);
            }

            this.logger.error(`Error searching YouTube for "${query}":`, error.message);
            // Try alternative method as fallback
            this.logger.warn('Trying alternative method...');
            return this.searchYouTubeAlternative(query);
        }
    }
}
