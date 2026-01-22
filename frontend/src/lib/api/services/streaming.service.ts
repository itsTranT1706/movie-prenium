import BaseApiClient from '../base-client';

class StreamingService extends BaseApiClient {
  async getStream(movieId: string) {
    return this.request<any>(`/streaming/${movieId}`);
  }
}

export default StreamingService;
