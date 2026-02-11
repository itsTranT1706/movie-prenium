import BaseApiClient from '@/shared/lib/api/base-client';

export interface YoutubeShort {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    videoUrl?: string;
    embedUrl?: string;
}

class YoutubeService extends BaseApiClient {
    async getShorts(mode: 'random' | 'related' = 'random', query?: string) {
        const params = new URLSearchParams({ mode });
        if (query) params.append('query', query);
        return this.request<YoutubeShort[]>(`/youtube/shorts?${params.toString()}`);
    }
}

export const youtubeService = new YoutubeService();
export default YoutubeService;
