import { RepositoryPort } from '@/shared/ports';
import { Favorite } from '../entities/favorite.entity';

export interface FavoriteRepositoryPort extends RepositoryPort<Favorite, string> {
    findByUserId(userId: string): Promise<Favorite[]>;
    findByUserAndMovie(userId: string, movieId: string): Promise<Favorite | null>;
    deleteByUserAndMovie(userId: string, movieId: string): Promise<void>;
}

export const FAVORITE_REPOSITORY = Symbol('FAVORITE_REPOSITORY');
