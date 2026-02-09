import BaseApiClient from '@/shared/lib/api/base-client';

class StreamingService extends BaseApiClient {
    async getStream(movieId: string) {
        return this.request<any>(`/streaming/${movieId}`);
    }
}

export const streamingService = new StreamingService();
export default StreamingService;
