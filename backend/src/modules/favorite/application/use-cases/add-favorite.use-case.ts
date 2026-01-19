import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '@/shared/domain';
import { Favorite, FAVORITE_REPOSITORY, FavoriteRepositoryPort } from '../../domain';

export interface AddFavoriteInput {
    userId: string;
    movieId: string;
}

@Injectable()
export class AddFavoriteUseCase {
    constructor(
        @Inject(FAVORITE_REPOSITORY)
        private readonly favoriteRepository: FavoriteRepositoryPort,
    ) { }

    async execute(input: AddFavoriteInput): Promise<Result<Favorite>> {
        // Check if already favorited
        const existing = await this.favoriteRepository.findByUserAndMovie(
            input.userId,
            input.movieId,
        );

        if (existing) {
            return Result.fail(new Error('Movie already in favorites'));
        }

        const favorite = Favorite.create(uuidv4(), {
            userId: input.userId,
            movieId: input.movieId,
            createdAt: new Date(),
        });

        await this.favoriteRepository.save(favorite);
        return Result.ok(favorite);
    }
}
