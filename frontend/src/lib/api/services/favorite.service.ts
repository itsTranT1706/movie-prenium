import BaseApiClient from '../base-client';
import { Favorite } from '@/types';

class FavoriteService extends BaseApiClient {
  async getFavorites() {
    return this.request<{ success: boolean; data: Favorite[] }>('/favorites');
  }

  async addFavorite(movieId: string, movieData?: any) {
    const body = movieData ? { movieData } : undefined;
    const response = await this.request<{ success: boolean; data: Favorite; message: string }>(`/favorites/${movieId}`, { 
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });

    // If request failed, throw error with the error message
    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async removeFavorite(movieId: string) {
    const response = await this.request<{ success: boolean; message: string }>(`/favorites/${movieId}`, { 
      method: 'DELETE' 
    });

    // If request failed, throw error with the error message
    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

export default FavoriteService;
