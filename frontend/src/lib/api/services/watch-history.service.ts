import BaseApiClient from '../base-client';

export interface WatchHistoryItem {
  id: string;
  userId: string;
  movieId: string;
  episodeNumber?: number;
  serverName?: string;
  firstWatchedAt: string;
  lastWatchedAt: string;
  completed: boolean;
  movie?: any;
}

class WatchHistoryService extends BaseApiClient {
  /**
   * Add or update watch history
   */
  async addWatchHistory(movieId: string, episodeNumber?: number, movieData?: any, serverName?: string) {
    const payload = { movieId, episodeNumber, serverName, movieData };
    console.log('🚀 [WatchHistoryService] Sending payload:', payload);
    console.log('🚀 [WatchHistoryService] Payload stringified:', JSON.stringify(payload));
    
    return this.request<WatchHistoryItem>('/watch-history', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Mark as completed
   */
  async markCompleted(movieId: string, episodeNumber?: number) {
    return this.request<WatchHistoryItem>('/watch-history/complete', {
      method: 'PATCH',
      body: JSON.stringify({ movieId, episodeNumber }),
    });
  }

  /**
   * Get continue watching list
   */
  async getContinueWatching(limit = 20) {
    const response = await this.request<WatchHistoryItem[]>(`/watch-history/continue?limit=${limit}`);
    // Handle ApiResponse wrapper
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as any).data || [];
    }
    return Array.isArray(response) ? response : [];
  }

  /**
   * Get full watch history
   */
  async getHistory(limit = 20, offset = 0) {
    const response = await this.request<WatchHistoryItem[]>(
      `/watch-history?limit=${limit}&offset=${offset}`
    );
    // Handle ApiResponse wrapper
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as any).data || [];
    }
    return Array.isArray(response) ? response : [];
  }

  /**
   * Remove from watch history
   */
  async removeWatchHistory(movieId: string, episodeNumber?: number) {
    return this.request('/watch-history', {
      method: 'DELETE',
      body: JSON.stringify({ movieId, episodeNumber }),
    });
  }
}

export default WatchHistoryService;
