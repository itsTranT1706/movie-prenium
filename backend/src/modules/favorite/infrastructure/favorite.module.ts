import { Module } from '@nestjs/common';
import { FAVORITE_REPOSITORY } from '../domain';
import { AddFavoriteUseCase, GetUserFavoritesUseCase } from '../application';
import { PrismaFavoriteRepository } from './adapters';
import { FavoriteController } from './controllers';

@Module({
    controllers: [FavoriteController],
    providers: [
        AddFavoriteUseCase,
        GetUserFavoritesUseCase,
        {
            provide: FAVORITE_REPOSITORY,
            useClass: PrismaFavoriteRepository,
        },
    ],
    exports: [FAVORITE_REPOSITORY],
})
export class FavoriteModule { }
