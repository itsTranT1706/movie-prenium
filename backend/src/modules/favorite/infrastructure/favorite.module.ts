import { Module } from '@nestjs/common';
import { FAVORITE_REPOSITORY } from '../domain';
import { AddFavoriteUseCase, GetUserFavoritesUseCase, RemoveFavoriteUseCase } from '../application';
import { PrismaFavoriteRepository } from './adapters';
import { FavoriteController } from './controllers';
import { MovieModule } from '@/modules/movie/infrastructure/movie.module';

@Module({
    imports: [MovieModule],
    controllers: [FavoriteController],
    providers: [
        AddFavoriteUseCase,
        GetUserFavoritesUseCase,
        RemoveFavoriteUseCase,
        {
            provide: FAVORITE_REPOSITORY,
            useClass: PrismaFavoriteRepository,
        },
    ],
    exports: [FAVORITE_REPOSITORY],
})
export class FavoriteModule { }
