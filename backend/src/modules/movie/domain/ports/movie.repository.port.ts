import { RepositoryPort } from '@/shared/ports';
import { Movie } from '../entities/movie.entity';

export interface MovieRepositoryPort extends RepositoryPort<Movie, string> {
    findByExternalId(externalId: string): Promise<Movie | null>;
    findByGenre(genre: string): Promise<Movie[]>;
    search(query: string): Promise<Movie[]>;
}

export const MOVIE_REPOSITORY = Symbol('MOVIE_REPOSITORY');
