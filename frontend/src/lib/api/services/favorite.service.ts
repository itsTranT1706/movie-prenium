import BaseApiClient from '../base-client';
import { Favorite } from '@/types';

class FavoriteService extends BaseApiClient {
  async getFavorites() {
    return this.request<Favorite[]>('/favorites');
  }

  async addFavorite(movieId: string) {
    return this.request<Favorite>(`/favorites/${movieId}`, { method: 'POST' });
  }
}

export default FavoriteService;
