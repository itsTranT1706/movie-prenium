import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Favorite, FAVORITE_REPOSITORY, FavoriteRepositoryPort } from '../../domain';

export interface GetUserFavoritesInput {
    userId: string;
}

@Injectable()
export class GetUserFavoritesUseCase {
    constructor(
        @Inject(FAVORITE_REPOSITORY)
        private readonly favoriteRepository: FavoriteRepositoryPort,
    ) { }

    async execute(input: GetUserFavoritesInput): Promise<Result<Favorite[]>> {
        const favorites = await this.favoriteRepository.findByUserId(input.userId);
        return Result.ok(favorites);
    }
}
