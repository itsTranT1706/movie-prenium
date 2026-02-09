import { Module } from '@nestjs/common';
import { TOP_BANNER_REPOSITORY } from '../domain';
import {
    GetTopBannersUseCase,
    CreateTopBannerUseCase,
    UpdateTopBannerUseCase,
    DeleteTopBannerUseCase
} from '../application';
import { PrismaTopBannerRepository } from './adapters';
import { TopBannerController } from './controllers';

@Module({
    controllers: [TopBannerController],
    providers: [
        GetTopBannersUseCase,
        CreateTopBannerUseCase,
        UpdateTopBannerUseCase,
        DeleteTopBannerUseCase,
        {
            provide: TOP_BANNER_REPOSITORY,
            useClass: PrismaTopBannerRepository,
        },
    ],
    exports: [TOP_BANNER_REPOSITORY],
})
export class TopBannerModule { }
